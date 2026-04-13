import * as Notifications from 'expo-notifications';

/**
 * Controls how notifications are shown while the app is open (foreground).
 * Banner + list + sound + max Android priority ≈ heads-up style (e.g. messaging apps).
 * Note: on Android, `shouldPlaySound: false` prevents the alert UI from showing at all.
 *
 * @see https://docs.expo.dev/versions/latest/sdk/notifications/
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: Notifications.AndroidNotificationPriority.MAX,
  }),
});
