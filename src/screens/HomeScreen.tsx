import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenSafeArea } from '../components/ScreenSafeArea';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'HomeScreen'>;

type HomeAction = {
  label: string;
  hint: string;
  route:
    | 'FlatListScreen'
    | 'SectionListScreen'
    | 'LegendListScreen'
    | 'CrashSyncScreen'
    | 'CrashAsyncScreen'
    | 'SettingsScreen';
};

const ACTIONS: HomeAction[] = [
  { label: 'FlatList Demo', hint: 'Open flat list screen', route: 'FlatListScreen' },
  { label: 'SectionList Demo', hint: 'Open sectioned list screen', route: 'SectionListScreen' },
  { label: 'LegendList Demo', hint: 'Open legend list screen', route: 'LegendListScreen' },
  { label: 'Crash Screen 1', hint: 'Trigger sync crash test', route: 'CrashSyncScreen' },
  { label: 'Crash Screen 2', hint: 'Trigger async crash test', route: 'CrashAsyncScreen' },
  { label: 'Settings', hint: 'Notification and app settings', route: 'SettingsScreen' },
];

export function HomeScreen({ navigation }: Props) {
  const onOpen = useCallback(
    (route: HomeAction['route']) => {
      navigation.navigate(route);
    },
    [navigation],
  );

  return (
    <ScreenSafeArea>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Crash Monitor App</Text>
        <Text style={styles.subtitle}>
          Choose a screen below. The home page only shows actions, not list contents.
        </Text>
        <View style={styles.card}>
          {ACTIONS.map((action, idx) => (
            <View key={action.route}>
              <Pressable
                accessibilityRole="button"
                onPress={() => onOpen(action.route)}
                style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              >
                <Text style={styles.rowLabel}>{action.label}</Text>
                <Text style={styles.rowHint}>{action.hint}</Text>
              </Pressable>
              {idx < ACTIONS.length - 1 ? <View style={styles.divider} /> : null}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    padding: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 16,
    color: '#4b5563',
    fontSize: 14,
  },
  card: {
    borderRadius: 12,
    borderColor: '#e5e7eb',
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowPressed: {
    backgroundColor: '#f9fafb',
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  rowHint: {
    marginTop: 4,
    fontSize: 13,
    color: '#6b7280',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e5e7eb',
  },
});
