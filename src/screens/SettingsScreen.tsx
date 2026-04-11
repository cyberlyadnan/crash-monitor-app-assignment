import { useCallback, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import {
  triggerAsyncCrashPlaceholder,
  triggerSyncCrashPlaceholder,
} from '../lib/crashHandlers';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'SettingsScreen'>;

export function SettingsScreen(_props: Props) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const onToggleNotifications = useCallback((value: boolean) => {
    setNotificationsEnabled(value);
  }, []);

  const onSyncCrash = useCallback(() => {
    triggerSyncCrashPlaceholder();
  }, []);

  const onAsyncCrash = useCallback(() => {
    void triggerAsyncCrashPlaceholder();
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Preferences</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.label}>Notifications</Text>
              <Text style={styles.sub}>Local toggle — backend wiring later.</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={onToggleNotifications}
              trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
              thumbColor={notificationsEnabled ? '#2563eb' : '#f4f4f5'}
            />
          </View>
        </View>
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
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
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
