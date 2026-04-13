import './src/lib/notificationsSetup';

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';
import { runInitialNotificationPermissionPrompt } from './src/lib/localNotifications';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://70244323f4ca51474eaa2cebd691a0cb@o4511205554061312.ingest.de.sentry.io/4511205556879440',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Keep app event capture enabled, but avoid noisy native SDK debug output in development.
  enableLogs: false,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  debug: false,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function App() {
  useEffect(() => {
    if (Platform.OS === 'web') return;
    const t = setTimeout(() => {
      void runInitialNotificationPermissionPrompt();
    }, 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
        <StatusBar
          style="dark"
          backgroundColor="#ffffff"
          translucent={Platform.OS === 'android' ? false : undefined}
        />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
