import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenSafeArea } from '../components/ScreenSafeArea';
import { fetchSentryIssueDetail, type SentryIssueDetailData } from '../lib/sentryApi';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'SentryIssueDetailScreen'>;

function formatIsoDate(iso?: string): string {
  if (!iso) return '-';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString();
}

function renderMetadataRows(metadata?: Record<string, unknown>): Array<{ key: string; value: string }> {
  if (!metadata) return [];
  return Object.entries(metadata).map(([key, value]) => {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return { key, value: String(value) };
    }
    try {
      return { key, value: JSON.stringify(value) };
    } catch {
      return { key, value: '[unserializable]' };
    }
  });
}

export function SentryIssueDetailScreen({ route }: Props) {
  const { issueId } = route.params;
  const [data, setData] = useState<SentryIssueDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const metadataRows = renderMetadataRows(data?.issue.metadata);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await fetchSentryIssueDetail(issueId);
      setData(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load issue details.');
    } finally {
      setLoading(false);
    }
  }, [issueId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <ScreenSafeArea>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.title}>Issue Details</Text>
            <Text style={styles.subtitle}>Issue ID: {issueId}</Text>
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
            <Text style={styles.loadingText}>Loading issue details...</Text>
          </View>
        ) : null}

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Unable to load issue</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {data ? (
          <>
            <View style={styles.card}>
              <Text style={styles.issueTitle}>
                {data.issue.shortId} - {data.issue.title}
              </Text>
              <Text style={styles.rowMeta}>Status: {data.issue.status}</Text>
              <Text style={styles.rowMeta}>Substatus: {data.issue.substatus || '-'}</Text>
              <Text style={styles.rowMeta}>Priority: {data.issue.priority || '-'}</Text>
              <Text style={styles.rowMeta}>Level: {data.issue.level}</Text>
              <Text style={styles.rowMeta}>Events: {data.issue.count}</Text>
              <Text style={styles.rowMeta}>Users: {data.issue.userCount}</Text>
              <Text style={styles.rowMeta}>First seen: {formatIsoDate(data.issue.firstSeen)}</Text>
              <Text style={styles.rowMeta}>Last seen: {formatIsoDate(data.issue.lastSeen)}</Text>
              <Text style={styles.rowMeta}>Culprit: {data.issue.culprit || '-'}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => void Linking.openURL(data.issue.permalink)}
                style={({ pressed }) => [styles.openLinkButton, pressed && styles.openLinkPressed]}
              >
                <Text style={styles.openLinkLabel}>Open in Sentry</Text>
              </Pressable>
            </View>

            <Text style={styles.sectionTitle}>Issue Metadata</Text>
            <View style={styles.card}>
              {metadataRows.length === 0 ? (
                <Text style={styles.emptyText}>No metadata available on this issue.</Text>
              ) : (
                metadataRows.map((item, idx) => (
                  <View key={item.key}>
                    <View style={styles.eventRow}>
                      <Text style={styles.metaKey}>{item.key}</Text>
                      <Text style={styles.metaValue}>{item.value}</Text>
                    </View>
                    {idx < metadataRows.length - 1 ? <View style={styles.divider} /> : null}
                  </View>
                ))
              )}
            </View>

            <Text style={styles.sectionTitle}>Recent Events For This Issue</Text>
            <View style={styles.card}>
              {data.recentEvents.length === 0 ? (
                <Text style={styles.emptyText}>No events found for this issue.</Text>
              ) : (
                data.recentEvents.map((event, idx) => (
                  <View key={event.id}>
                    <View style={styles.eventRow}>
                      <Text style={styles.eventTitle}>{event.title || event.message || event.id}</Text>
                      <Text style={styles.rowMeta}>Level: {event.level}</Text>
                      <Text style={styles.rowMeta}>Time: {formatIsoDate(event.timestamp)}</Text>
                    </View>
                    {idx < data.recentEvents.length - 1 ? <View style={styles.divider} /> : null}
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
  headerTextWrap: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#6b7280',
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
  card: {
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    padding: 14,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 6,
  },
  rowMeta: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
  },
  openLinkButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#eff6ff',
  },
  openLinkPressed: {
    opacity: 0.8,
  },
  openLinkLabel: {
    color: '#1d4ed8',
    fontWeight: '600',
    fontSize: 13,
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
  eventRow: {
    paddingVertical: 10,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  metaKey: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metaValue: {
    marginTop: 4,
    fontSize: 13,
    color: '#1f2937',
  },
  emptyText: {
    fontSize: 13,
    color: '#6b7280',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e5e7eb',
  },
});
