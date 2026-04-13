import { useHeaderHeight } from '@react-navigation/elements';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
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
  deriveNotificationSwitchOn,
  ensureAndroidNotificationChannel,
  getNotificationSwitchStored,
  getPermissionGranted,
  isNotificationSupported,
  openAppNotificationSettings,
  requestNotificationPermission,
  setNotificationSwitchStored,
  showLocalNotificationIfAllowed,
} from '../lib/localNotifications';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'SettingsScreen'>;

export function SettingsScreen(_props: Props) {
  const headerHeight = useHeaderHeight();
  const [notificationsAllowed, setNotificationsAllowed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [notificationInitError, setNotificationInitError] = useState<string | null>(null);

  const syncNotificationSwitch = useCallback(async () => {
    const [osGranted, stored] = await Promise.all([getPermissionGranted(), getNotificationSwitchStored()]);
    setNotificationsAllowed(deriveNotificationSwitchOn(osGranted, stored));
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      void (async () => {
        setNotificationInitError(null);
        try {
          await ensureAndroidNotificationChannel();
          if (cancelled) return;
          await syncNotificationSwitch();
        } catch (e) {
          if (!cancelled) {
            setNotificationInitError(e instanceof Error ? e.message : 'Notification setup failed');
          }
        } finally {
          if (!cancelled) {
            setHydrated(true);
          }
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [syncNotificationSwitch]),
  );

  const onToggleNotifications = useCallback(
    async (value: boolean) => {
      if (!isNotificationSupported()) return;

      if (value) {
        await setNotificationSwitchStored(true);
        const granted = await requestNotificationPermission();
        const stored = await getNotificationSwitchStored();
        const osGranted = await getPermissionGranted();
        setNotificationsAllowed(deriveNotificationSwitchOn(osGranted, stored));
        if (!granted) {
          Alert.alert('Permission required', 'You can enable notifications for this app in system settings.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open settings', onPress: () => void openAppNotificationSettings() },
          ]);
        }
        return;
      }

      await setNotificationSwitchStored(false);
      await cancelAllScheduledNotifications();
      setNotificationsAllowed(false);
    },
    [],
  );

  const onShowNotification = useCallback(async () => {
    if (!isNotificationSupported()) {
      Alert.alert('Not available', 'Local notifications require an iOS or Android build.');
      return;
    }
    if (!notificationsAllowed) {
      Alert.alert('Notifications off', 'Turn on “Allow notifications” and accept the system permission first.');
      return;
    }

    const result = await showLocalNotificationIfAllowed();
    if (!result.ok) {
      Alert.alert(
        'Notifications off',
        'The system is not allowing notifications for this app. Turn them on in settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open settings', onPress: () => void openAppNotificationSettings() },
        ],
      );
      await syncNotificationSwitch();
    }
  }, [notificationsAllowed, syncNotificationSwitch]);

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
              <Text style={styles.sectionHeading}>Notifications</Text>
              {!nativeNotifications ? (
                <View style={styles.card}>
                  <Text style={styles.webNote}>
                    Local notifications are not available on web. Use the iOS or Android app.
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={styles.explainer}>
                    Turn on to request OS permission. You can turn off here anytime to stop alerts from
                    this app (the switch stays off even if the system still allows notifications—use system
                    settings to revoke completely).
                  </Text>
                  {notificationInitError ? (
                    <View style={styles.errorBanner}>
                      <Text style={styles.errorText}>{notificationInitError}</Text>
                    </View>
                  ) : null}
                  {Platform.OS === 'android' ? (
                    <Text style={styles.platformHint}>
                      Android 13+: use the switch to trigger the permission dialog, or open app settings.
                    </Text>
                  ) : null}
                  <View style={styles.card}>
                    <View style={styles.row}>
                      <View style={styles.rowText}>
                        <Text style={styles.label}>Allow notifications</Text>
                        <Text style={styles.sub}>
                          {hydrated
                            ? notificationsAllowed
                              ? 'Permission granted.'
                              : 'Off — turn on to request permission.'
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
                    {hydrated && !notificationsAllowed ? (
                      <>
                        <View style={styles.divider} />
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => void openAppNotificationSettings()}
                          style={({ pressed }) => [styles.openSettingsRow, pressed && styles.buttonPressed]}
                        >
                          <Text style={styles.openSettingsLabel}>Open app settings</Text>
                          <Text style={styles.openSettingsHint}>
                            Enable notifications here if the system dialog did not appear.
                          </Text>
                        </Pressable>
                      </>
                    ) : null}
                  </View>

                  <View style={styles.card}>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => void onShowNotification()}
                      // disabled={!hydrated || !notificationsAllowed}
                      style={({ pressed }) => [
                        styles.actionButton,
                        styles.actionPrimary,
                        (!hydrated || !notificationsAllowed) && styles.actionDisabled,
                        pressed && hydrated && notificationsAllowed && styles.actionPressed,
                      ]}
                    >
                      <Text style={styles.actionPrimaryLabel}>Show notification</Text>
                      <Text style={styles.actionHint}>
                        Fires immediately only when notification permission is on.
                      </Text>
                    </Pressable>
                  </View>
                </>
              )}
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
  platformHint: {
    fontSize: 12,
    lineHeight: 17,
    color: '#6b7280',
    marginBottom: 12,
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 13,
    color: '#991b1b',
  },
  openSettingsRow: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  openSettingsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  openSettingsHint: {
    marginTop: 4,
    fontSize: 13,
    color: '#6b7280',
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
  buttonPressed: {
    backgroundColor: '#f9fafb',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e5e7eb',
  },
});
