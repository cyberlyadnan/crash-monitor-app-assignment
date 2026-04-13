import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenSafeArea } from '../components/ScreenSafeArea';
import { fetchSentryDashboardData, type SentryDashboardData } from '../lib/sentryApi';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'SentryMonitorScreen'>;

function formatIsoDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString();
}

function getIssueLast24hTotal(stats?: Record<string, Array<[number, number]>>): number {
  const points = stats?.['24h'];
  if (!points || points.length === 0) return 0;
  return points.reduce((sum, point) => sum + (point[1] ?? 0), 0);
}

export function SentryMonitorScreen(_props: Props) {
  const { navigation } = _props;
  const [data, setData] = useState<SentryDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await fetchSentryDashboardData();
      setData(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load Sentry dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const fetchedLabel = useMemo(() => {
    if (!data) return '-';
    return formatIsoDate(data.fetchedAt);
  }, [data]);

  return (
    <ScreenSafeArea>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Sentry Monitor</Text>
            <Text style={styles.subtitle}>Live issues and error events from your Sentry project</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => void load()}
            style={({ pressed }) => [styles.refreshButton, pressed && styles.refreshPressed]}
          >
            <Text style={styles.refreshLabel}>Refresh</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="small" color="#2563eb" />
            <Text style={styles.loadingText}>Loading Sentry data...</Text>
          </View>
        ) : null}

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Unable to load Sentry data</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {data ? (
          <>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{data.unresolvedIssueCount}</Text>
                <Text style={styles.statLabel}>Unresolved Issues</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{data.totalIssueEventCount}</Text>
                <Text style={styles.statLabel}>Issue Event Count</Text>
              </View>
              <View style={styles.statCardWide}>
                <Text style={styles.statValueSmall}>{fetchedLabel}</Text>
                <Text style={styles.statLabel}>Last Synced</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Recent Issues</Text>
            <View style={styles.card}>
              {data.issues.length === 0 ? (
                <Text style={styles.emptyText}>No unresolved issues in the last 24 hours.</Text>
              ) : (
                data.issues.map((issue, idx) => (
                  <View key={issue.id}>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() =>
                        navigation.navigate('SentryIssueDetailScreen', { issueId: issue.id })
                      }
                      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
                    >
                      <Text style={styles.rowTitle}>
                        {issue.shortId} - {issue.title}
                      </Text>
                      <Text style={styles.rowMeta}>
                        level: {issue.level} | events: {issue.count} | users: {issue.userCount}
                      </Text>
                      <Text style={styles.rowMeta}>
                        priority: {issue.priority || '-'} | substatus: {issue.substatus || '-'}
                      </Text>
                      <Text style={styles.rowMeta}>culprit: {issue.culprit || '-'}</Text>
                      <Text style={styles.rowMeta}>
                        first seen: {issue.firstSeen ? formatIsoDate(issue.firstSeen) : '-'}
                      </Text>
                      <Text style={styles.rowMeta}>last seen: {formatIsoDate(issue.lastSeen)}</Text>
                      <Text style={styles.rowMeta}>
                        last 24h trend count: {getIssueLast24hTotal(issue.stats)}
                      </Text>
                      {typeof issue.metadata?.value === 'string' ? (
                        <Text style={styles.rowMeta}>message: {issue.metadata.value}</Text>
                      ) : null}
                      <Text style={styles.openDetail}>Tap for full issue details</Text>
                    </Pressable>
                    {idx < data.issues.length - 1 ? <View style={styles.divider} /> : null}
                  </View>
                ))
              )}
            </View>

            <Text style={styles.sectionTitle}>Recent Error Events</Text>
            <View style={styles.card}>
              {data.events.length === 0 ? (
                <Text style={styles.emptyText}>No recent error events returned by Sentry API.</Text>
              ) : (
                data.events.map((event, idx) => (
                  <View key={event.id}>
                    <View style={styles.row}>
                      <Text style={styles.rowTitle}>{event.title || event.message || event.id}</Text>
                      <Text style={styles.rowMeta}>level: {event.level}</Text>
                      <Text style={styles.rowMeta}>time: {formatIsoDate(event.timestamp)}</Text>
                    </View>
                    {idx < data.events.length - 1 ? <View style={styles.divider} /> : null}
                  </View>
                ))
              )}
            </View>
          </>
        ) : null}
      </ScrollView>
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#4b5563',
    maxWidth: 250,
  },
  refreshButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  refreshPressed: {
    opacity: 0.85,
  },
  refreshLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingCard: {
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loadingText: {
    color: '#374151',
    fontSize: 14,
  },
  errorCard: {
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: '#fef2f2',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#fecaca',
    padding: 14,
  },
  errorTitle: {
    color: '#991b1b',
    fontWeight: '700',
    fontSize: 14,
  },
  errorText: {
    marginTop: 6,
    color: '#7f1d1d',
    fontSize: 13,
    lineHeight: 18,
  },
  statsGrid: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    flexGrow: 1,
    minWidth: 140,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    padding: 14,
  },
  statCardWide: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    padding: 14,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  statValueSmall: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowPressed: {
    backgroundColor: '#f9fafb',
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  rowMeta: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
  },
  openDetail: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
  emptyText: {
    padding: 16,
    color: '#6b7280',
    fontSize: 14,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e5e7eb',
  },
});
