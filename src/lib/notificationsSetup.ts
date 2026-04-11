import * as Notifications from 'expo-notifications';

/**
 * Required so alerts show while the app is in the foreground.
 * @see https://docs.expo.dev/versions/latest/sdk/notifications/
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
