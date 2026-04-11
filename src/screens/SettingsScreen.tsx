import { useHeaderHeight } from '@react-navigation/elements';
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import { ScreenSafeArea } from '../components/ScreenSafeArea';
import {
  cancelAllScheduledNotifications,
  cancelScheduledNotification,
  countScheduledNotifications,
  ensureAndroidNotificationChannel,
  findRepeatingDemoScheduleId,
  getPermissionGranted,
  isNotificationSupported,
  REPEATING_INTERVAL_SECONDS,
  requestNotificationPermission,
  scheduleRepeatingDemo,
  scheduleTestNotificationNow,
} from '../lib/localNotifications';
import {
  triggerAsyncCrashPlaceholder,
  triggerSyncCrashPlaceholder,
} from '../lib/crashHandlers';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'SettingsScreen'>;

export function SettingsScreen(_props: Props) {
  const headerHeight = useHeaderHeight();
  const [notificationsAllowed, setNotificationsAllowed] = useState(false);
  const [repeatingScheduleId, setRepeatingScheduleId] = useState<string | null>(null);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const refreshScheduleState = useCallback(async () => {
    const [count, repeatingId] = await Promise.all([
      countScheduledNotifications(),
      findRepeatingDemoScheduleId(),
    ]);
    setScheduledCount(count);
    setRepeatingScheduleId(repeatingId);
  }, []);

  useEffect(() => {
    void (async () => {
      await ensureAndroidNotificationChannel();
      const granted = await getPermissionGranted();
      setNotificationsAllowed(granted);
      await refreshScheduleState();
      setHydrated(true);
    })();
  }, [refreshScheduleState]);

  const onToggleNotifications = useCallback(
    async (value: boolean) => {
      if (!isNotificationSupported()) return;

      if (value) {
        const granted = await requestNotificationPermission();
        setNotificationsAllowed(granted);
        if (!granted) {
          Alert.alert(
            'Permission required',
            'Enable notifications for this app in system settings to see local alerts.',
          );
        }
        await refreshScheduleState();
        return;
      }

      await cancelAllScheduledNotifications();
      setRepeatingScheduleId(null);
      setNotificationsAllowed(false);
      await refreshScheduleState();
    },
    [refreshScheduleState],
  );

  const onSendTestNotification = useCallback(async () => {
    if (!isNotificationSupported()) {
      Alert.alert('Not available', 'Local notifications require the iOS or Android build.');
      return;
    }
    if (!notificationsAllowed) {
      Alert.alert('Turn on notifications', 'Enable the toggle above and grant permission first.');
      return;
    }
    try {
      await scheduleTestNotificationNow();
      await refreshScheduleState();
    } catch (e) {
      Alert.alert('Could not schedule', e instanceof Error ? e.message : 'Unknown error');
    }
  }, [notificationsAllowed, refreshScheduleState]);

  const onStartRepeating = useCallback(async () => {
    if (!isNotificationSupported()) {
      Alert.alert('Not available', 'Local notifications require the iOS or Android build.');
      return;
    }
    if (!notificationsAllowed) {
      Alert.alert('Turn on notifications', 'Enable the toggle and allow permission first.');
      return;
    }
    if (repeatingScheduleId) {
      return;
    }
    try {
      const id = await scheduleRepeatingDemo();
      setRepeatingScheduleId(id);
      await refreshScheduleState();
    } catch (e) {
      Alert.alert('Could not start', e instanceof Error ? e.message : 'Unknown error');
    }
  }, [notificationsAllowed, repeatingScheduleId, refreshScheduleState]);

  const onPauseRepeating = useCallback(async () => {
    if (!repeatingScheduleId) return;
    try {
      await cancelScheduledNotification(repeatingScheduleId);
      setRepeatingScheduleId(null);
      await refreshScheduleState();
    } catch (e) {
      Alert.alert('Could not pause', e instanceof Error ? e.message : 'Unknown error');
    }
  }, [repeatingScheduleId, refreshScheduleState]);

  const onSyncCrash = useCallback(() => {
    triggerSyncCrashPlaceholder();
  }, []);

  const onAsyncCrash = useCallback(() => {
    void triggerAsyncCrashPlaceholder();
  }, []);

  const repeatingActive = repeatingScheduleId !== null;
  const nativeNotifications = isNotificationSupported();

  return (
    <ScreenSafeArea>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.screen}>
            <View style={styles.section}>
          <Text style={styles.sectionHeading}>Local notifications</Text>
          {!nativeNotifications ? (
            <View style={styles.card}>
              <Text style={styles.webNote}>
                Expo web does not support local notifications. Use Android or iOS to try the demo.
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.explainer}>
                The switch requests OS permission and keeps our schedules. Start begins a repeating
                reminder every {REPEATING_INTERVAL_SECONDS}s (iOS minimum for repeating). Pause stops
                those future alerts without revoking permission—turn the switch off to cancel everything.
              </Text>
              <View style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.rowText}>
                    <Text style={styles.label}>Allow notifications</Text>
                    <Text style={styles.sub}>
                      {hydrated
                        ? notificationsAllowed
                          ? 'Permission granted — you can test or start repeating alerts.'
                          : 'Off — turn on to request permission and enable demos.'
                        : 'Loading…'}
                    </Text>
                  </View>
                  <Switch
                    value={notificationsAllowed}
                    onValueChange={onToggleNotifications}
                    disabled={!hydrated}
                    trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                    thumbColor={notificationsAllowed ? '#2563eb' : '#f4f4f5'}
                  />
                </View>
              </View>

              <View style={styles.card}>
                <Pressable
                  accessibilityRole="button"
                  onPress={onSendTestNotification}
                  disabled={!hydrated || !notificationsAllowed}
                  style={({ pressed }) => [
                    styles.actionButton,
                    styles.actionPrimary,
                    (!hydrated || !notificationsAllowed) && styles.actionDisabled,
                    pressed && hydrated && notificationsAllowed && styles.actionPressed,
                  ]}
                >
                  <Text style={styles.actionPrimaryLabel}>Send test notification</Text>
                  <Text style={styles.actionHint}>Fires immediately so you can see a local alert.</Text>
                </Pressable>

                <View style={styles.divider} />

                <View style={styles.dualRow}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={onStartRepeating}
                    disabled={!hydrated || !notificationsAllowed || repeatingActive}
                    style={({ pressed }) => [
                      styles.halfButton,
                      styles.startButton,
                      (!hydrated || !notificationsAllowed || repeatingActive) && styles.actionDisabled,
                      pressed &&
                        hydrated &&
                        notificationsAllowed &&
                        !repeatingActive &&
                        styles.actionPressed,
                    ]}
                  >
                    <Text style={styles.startLabel}>Start</Text>
                    <Text style={styles.dualHint}>Repeating</Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    onPress={onPauseRepeating}
                    disabled={!hydrated || !repeatingActive}
                    style={({ pressed }) => [
                      styles.halfButton,
                      styles.pauseButton,
                      (!hydrated || !repeatingActive) && styles.actionDisabled,
                      pressed && hydrated && repeatingActive && styles.actionPressed,
                    ]}
                  >
                    <Text style={styles.pauseLabel}>Pause</Text>
                    <Text style={styles.dualHint}>Stops repeats</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.statusBox}>
                <Text style={styles.statusLine}>
                  Repeating demo:{' '}
                  <Text style={repeatingActive ? styles.statusOn : styles.statusOff}>
                    {repeatingActive ? 'running' : 'paused'}
                  </Text>
                </Text>
                <Text style={styles.statusMeta}>
                  Scheduled requests in queue: {scheduledCount}
                  {Platform.OS === 'ios' ? ' · iOS uses 60s+ for repeating' : ''}
                </Text>
              </View>
            </>
          )}
            </View>

            <View style={styles.section}>
          <Text style={styles.sectionHeading}>Diagnostics</Text>
          <View style={styles.card}>
            <Pressable
              accessibilityRole="button"
              onPress={onSyncCrash}
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            >
              <Text style={styles.buttonLabel}>Trigger Crash</Text>
            </Pressable>
            <View style={styles.divider} />
            <Pressable
              accessibilityRole="button"
              onPress={onAsyncCrash}
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            >
              <Text style={styles.buttonLabel}>Trigger Async Crash</Text>
            </Pressable>
            </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  screen: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  explainer: {
    fontSize: 13,
    lineHeight: 19,
    color: '#4b5563',
    marginBottom: 12,
  },
  webNote: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4b5563',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  rowText: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  sub: {
    marginTop: 4,
    fontSize: 13,
    color: '#6b7280',
  },
  actionButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  actionPrimary: {
    backgroundColor: '#fff',
  },
  actionDisabled: {
    opacity: 0.45,
  },
  actionPressed: {
    backgroundColor: '#f9fafb',
  },
  actionPrimaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  actionHint: {
    marginTop: 6,
    fontSize: 13,
    color: '#6b7280',
  },
  dualRow: {
    flexDirection: 'row',
  },
  halfButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  startButton: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#e5e7eb',
  },
  pauseButton: {},
  startLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#047857',
  },
  pauseLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#b45309',
  },
  dualHint: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
  },
  statusBox: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  statusLine: {
    fontSize: 14,
    color: '#374151',
  },
  statusOn: {
    fontWeight: '700',
    color: '#047857',
  },
  statusOff: {
    fontWeight: '700',
    color: '#9ca3af',
  },
  statusMeta: {
    marginTop: 4,
    fontSize: 12,
    color: '#6b7280',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#f9fafb',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#b91c1c',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e5e7eb',
  },
});
