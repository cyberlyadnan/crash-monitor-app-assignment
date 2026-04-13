import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Linking, PermissionsAndroid, Platform } from 'react-native';

/** New id when channel importance changes — Android ignores importance updates on an existing channel. */
const ANDROID_CHANNEL_ID = 'foreground-message-alerts';

export async function ensureAndroidNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: 'Message alerts',
    description: 'High-priority local notifications while the app is open or in background',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    enableVibrate: true,
    sound: 'default',
    showBadge: true,
  });
}

function withHeadsUpPresentation(
  content: Notifications.NotificationContentInput,
): Notifications.NotificationContentInput {
  if (Platform.OS === 'android') {
    return {
      ...content,
      priority: Notifications.AndroidNotificationPriority.MAX,
    };
  }
  if (Platform.OS === 'ios') {
    return {
      ...content,
      interruptionLevel: 'active',
    };
  }
  return content;
}

export function isNotificationSupported(): boolean {
  return Platform.OS !== 'web';
}

const NOTIFICATION_PROMPT_DONE_KEY = '@crash_monitor/notif_prompt_done_v1';

/** User toggle in Settings: `'0'` = off in app (even if OS still allows), `'1'` = on, `null` = unset (follow OS). */
const SETTINGS_NOTIFICATION_SWITCH_KEY = '@crash_monitor/settings_notif_switch_v1';

export async function getNotificationSwitchStored(): Promise<string | null> {
  return AsyncStorage.getItem(SETTINGS_NOTIFICATION_SWITCH_KEY);
}

export async function setNotificationSwitchStored(on: boolean): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_NOTIFICATION_SWITCH_KEY, on ? '1' : '0');
}

/**
 * Switch UI: off if user chose off in app; otherwise follows OS permission.
 */
export function deriveNotificationSwitchOn(osGranted: boolean, stored: string | null): boolean {
  if (stored === '0') return false;
  if (stored === '1') return osGranted;
  return osGranted;
}

export async function getNotificationsEffectiveEnabled(): Promise<boolean> {
  const [osGranted, stored] = await Promise.all([
    getPermissionGranted(),
    getNotificationSwitchStored(),
  ]);
  return deriveNotificationSwitchOn(osGranted, stored);
}

function getAndroidApiLevel(): number {
  if (Platform.OS !== 'android') return 0;
  const v = Platform.Version;
  return typeof v === 'number' ? v : parseInt(String(v), 10);
}

export async function getPermissionGranted(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

export async function requestNotificationPermission(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.status === 'granted') return true;

  if (Platform.OS === 'android' && getAndroidApiLevel() >= 33) {
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    const rnGranted = result === PermissionsAndroid.RESULTS.GRANTED;
    const after = await Notifications.getPermissionsAsync();
    return rnGranted || after.status === 'granted';
  }

  const next = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: true, allowSound: true },
    android: {},
  });
  return next.status === 'granted';
}

export async function runInitialNotificationPermissionPrompt(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const done = await AsyncStorage.getItem(NOTIFICATION_PROMPT_DONE_KEY);
    if (done === '1') return;

    const { status } = await Notifications.getPermissionsAsync();
    if (status === 'granted') {
      await AsyncStorage.setItem(NOTIFICATION_PROMPT_DONE_KEY, '1');
      return;
    }

    await requestNotificationPermission();
    await AsyncStorage.setItem(NOTIFICATION_PROMPT_DONE_KEY, '1');
  } catch {
    await AsyncStorage.setItem(NOTIFICATION_PROMPT_DONE_KEY, '1');
  }
}

export async function openAppNotificationSettings(): Promise<void> {
  await Linking.openSettings();
}

/**
 * Presents one local notification as soon as the OS allows (after permission + channel).
 * Call only when `getPermissionGranted()` is true — or use `showLocalNotificationIfAllowed`.
 */
export async function showLocalNotificationNow(): Promise<void> {
  const trigger: Notifications.NotificationTriggerInput =
    Platform.OS === 'android' ? { channelId: ANDROID_CHANNEL_ID } : null;

  await Notifications.scheduleNotificationAsync({
    content: withHeadsUpPresentation({
      title: 'Local notification',
      body: 'You enabled notifications and tapped the button — this fires immediately.',
      sound: true,
    }),
    trigger,
  });
}

/** Respects Settings switch + OS permission (user can turn off in app without revoking OS permission). */
export async function showLocalNotificationIfAllowed(): Promise<{ ok: true } | { ok: false; reason: 'denied' }> {
  const effective = await getNotificationsEffectiveEnabled();
  if (!effective) {
    return { ok: false, reason: 'denied' };
  }
  await showLocalNotificationNow();
  return { ok: true };
}

export async function cancelAllScheduledNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
