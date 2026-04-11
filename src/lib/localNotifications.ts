import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const ANDROID_CHANNEL_ID = 'demo-local-notifications';

/** iOS requires ≥60s interval when `repeats` is true. */
export const REPEATING_INTERVAL_SECONDS = 60;

export async function ensureAndroidNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: 'Demo alerts',
    description: 'Sample local notifications from Settings',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
  });
}

export function isNotificationSupported(): boolean {
  return Platform.OS !== 'web';
}

export async function getPermissionGranted(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

export async function requestNotificationPermission(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.status === 'granted') return true;
  const next = await Notifications.requestPermissionsAsync();
  return next.status === 'granted';
}

export async function scheduleTestNotificationNow(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Local notification',
      body:
        'This fired immediately. Use Start / Pause below to control repeating reminders.',
      sound: true,
    },
    trigger: null,
  });
}

export async function scheduleRepeatingDemo(): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Repeating demo',
      body: `Fires every ${REPEATING_INTERVAL_SECONDS}s while active. Pause stops the series.`,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: REPEATING_INTERVAL_SECONDS,
      repeats: true,
      ...(Platform.OS === 'android' ? { channelId: ANDROID_CHANNEL_ID } : {}),
    },
  });
}

export async function cancelScheduledNotification(id: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(id);
}

export async function cancelAllScheduledNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function countScheduledNotifications(): Promise<number> {
  const pending = await Notifications.getAllScheduledNotificationsAsync();
  return pending.length;
}

/** Restores UI state after reload: finds our repeating demo schedule if it still exists. */
export async function findRepeatingDemoScheduleId(): Promise<string | null> {
  const pending = await Notifications.getAllScheduledNotificationsAsync();
  const match = pending.find((r) => r.content.title === 'Repeating demo');
  return match?.identifier ?? null;
}
