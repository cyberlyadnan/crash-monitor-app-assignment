export type SentryIssue = {
  id: string;
  shareId?: string | null;
  shortId: string;
  title: string;
  culprit?: string;
  level: string;
  status: string;
  substatus?: string;
  priority?: string;
  count: string;
  userCount: number;
  permalink: string;
  firstSeen?: string;
  lastSeen: string;
  metadata?: Record<string, unknown>;
  stats?: Record<string, Array<[number, number]>>;
};

export type SentryEvent = {
  id: string;
  project: string;
  title: string;
  message: string;
  level: string;
  timestamp: string;
};

export type SentryIssueDetail = SentryIssue & {
  culprit?: string;
  firstSeen?: string;
  metadata?: Record<string, unknown>;
};

export type SentryDashboardData = {
  fetchedAt: string;
  unresolvedIssueCount: number;
  totalIssueEventCount: number;
  issues: SentryIssue[];
  events: SentryEvent[];
};

export type SentryIssueDetailData = {
  issue: SentryIssueDetail;
  recentEvents: SentryEvent[];
};

const SENTRY_API_BASE = 'https://sentry.io/api/0';
const SENTRY_ORG_SLUG = 'growth-technos';
const SENTRY_PROJECT_SLUG = 'react-native';

function parseCount(value: string): number {
  const count = Number.parseInt(value, 10);
  return Number.isFinite(count) ? count : 0;
}

function buildAuthToken(): string | null {
  const token = process.env.EXPO_PUBLIC_SENTRY_AUTH_TOKEN;
  if (!token) return null;
  return token.trim().length > 0 ? token.trim() : null;
}

async function sentryGet<T>(path: string): Promise<T> {
  const token = buildAuthToken();
  if (!token) {
    throw new Error(
      'Missing EXPO_PUBLIC_SENTRY_AUTH_TOKEN. Add it to your .env.local and rebuild the app.',
    );
  }

  const response = await fetch(`${SENTRY_API_BASE}${path}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Sentry API failed (${response.status}): ${body || response.statusText}`);
  }

  return (await response.json()) as T;
}

async function sentryGetWithFallback<T>(paths: string[]): Promise<T> {
  let lastError: Error | null = null;
  for (const path of paths) {
    try {
      return await sentryGet<T>(path);
    } catch (e) {
      const error = e instanceof Error ? e : new Error('Unknown Sentry API error');
      if (!error.message.includes('(404)')) {
        throw error;
      }
      lastError = error;
    }
  }

  throw (
    lastError ??
    new Error('Sentry API returned 404 for all known endpoint variants for this resource.')
  );
}

export async function fetchSentryDashboardData(): Promise<SentryDashboardData> {
  const issuesPath = `/projects/${SENTRY_ORG_SLUG}/${SENTRY_PROJECT_SLUG}/issues/?query=is:unresolved&statsPeriod=24h&limit=10`;
  const eventsPath = `/projects/${SENTRY_ORG_SLUG}/${SENTRY_PROJECT_SLUG}/events/?query=event.type:error&statsPeriod=24h&field=title&field=message&field=level&field=timestamp&sort=-timestamp&per_page=10`;

  const [issues, events] = await Promise.all([
    sentryGet<SentryIssue[]>(issuesPath),
    sentryGet<SentryEvent[]>(eventsPath),
  ]);

  const totalIssueEventCount = issues.reduce((sum, issue) => sum + parseCount(issue.count), 0);

  return {
    fetchedAt: new Date().toISOString(),
    unresolvedIssueCount: issues.length,
    totalIssueEventCount,
    issues,
    events,
  };
}

export async function fetchSentryIssueDetail(issueId: string): Promise<SentryIssueDetailData> {
  const safeIssueId = encodeURIComponent(issueId);
  const issuePaths = [
    `/issues/${safeIssueId}/`,
    `/organizations/${SENTRY_ORG_SLUG}/issues/${safeIssueId}/`,
  ];
  const issueEventsPaths = [
    `/issues/${safeIssueId}/events/?full=true&per_page=20`,
    `/organizations/${SENTRY_ORG_SLUG}/issues/${safeIssueId}/events/?full=true&per_page=20`,
  ];

  const [issue, recentEvents] = await Promise.all([
    sentryGetWithFallback<SentryIssueDetail>(issuePaths),
    sentryGetWithFallback<SentryEvent[]>(issueEventsPaths),
  ]);

  return {
    issue,
    recentEvents,
  };
}
