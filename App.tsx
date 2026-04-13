import './src/lib/notificationsSetup';

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';
import { runInitialNotificationPermissionPrompt } from './src/lib/localNotifications';

export default function App() {
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
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
