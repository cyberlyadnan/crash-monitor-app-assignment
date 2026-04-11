import '@/services/sentry';

import * as Sentry from '@sentry/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { AppNavigator } from '@/navigation';
import { colors, spacing } from '@/constants';

function App() {
  return (
    <SafeAreaProvider>
      <Sentry.ErrorBoundary
        fallback={({ error, resetError }) => (
          <SafeAreaView style={styles.fallbackRoot} edges={['top', 'bottom', 'left', 'right']}>
            <Text style={styles.fallbackTitle}>Something went wrong</Text>
            <Text style={styles.fallbackMessage}>{String(error)}</Text>
            <Pressable
              onPress={resetError}
              style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
            >
              <Text style={styles.retryLabel}>Try again</Text>
            </Pressable>
          </SafeAreaView>
        )}
      >
        <NavigationContainer>
          <StatusBar style="dark" />
          <AppNavigator />
        </NavigationContainer>
      </Sentry.ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  fallbackRoot: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  fallbackMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  retryButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    backgroundColor: `${colors.tint}18`,
  },
  retryButtonPressed: {
    opacity: 0.9,
  },
  retryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.tint,
  },
});

export default Sentry.wrap(App);
