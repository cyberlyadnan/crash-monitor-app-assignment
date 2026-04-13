import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenSafeArea } from '../components/ScreenSafeArea';
import { sendDiagnosticLog, triggerSyncCrash } from '../lib/crashHandlers';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'CrashSyncScreen'>;

export function CrashSyncScreen(_props: Props) {
  const onLogOnly = () => {
    sendDiagnosticLog('Manual Sentry log from CrashSyncScreen');
    Alert.alert('Sent', 'A diagnostic log message was sent to Sentry.');
  };

  const onCrashNow = () => {
    triggerSyncCrash();
  };

  return (
    <ScreenSafeArea>
      <View style={styles.container}>
        <Text style={styles.title}>Crash Screen 1 (Sync)</Text>
        <Text style={styles.description}>
          Use this screen to test immediate crash reporting and event visibility in Sentry.
        </Text>

        <View style={styles.card}>
          <Pressable
            accessibilityRole="button"
            onPress={onLogOnly}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.logLabel}>Send test log to Sentry</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable
            accessibilityRole="button"
            onPress={onCrashNow}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.crashLabel}>Trigger sync crash</Text>
          </Pressable>
        </View>
      </View>
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 24,
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  description: {
    marginTop: 8,
    marginBottom: 16,
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  buttonPressed: {
    backgroundColor: '#f9fafb',
  },
  logLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  crashLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#b91c1c',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e5e7eb',
  },
});
