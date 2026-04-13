import { Ionicons } from '@expo/vector-icons';
import type { NavigationProp } from '@react-navigation/native';
import { Pressable, StyleSheet, View } from 'react-native';

import type { RootStackParamList } from '../types/navigation';

type RouteKey = keyof RootStackParamList;
type HeaderRouteKey = {
  [K in RouteKey]: RootStackParamList[K] extends undefined ? K : never;
}[RouteKey];

const NAV_TARGETS: {
  name: HeaderRouteKey;
  icon: keyof typeof Ionicons.glyphMap;
  accessibilityLabel: string;
}[] = [
  {
    name: 'HomeScreen',
    icon: 'home-outline',
    accessibilityLabel: 'Go to home',
  },
  {
    name: 'FlatListScreen',
    icon: 'list-outline',
    accessibilityLabel: 'Go to FlatList demo',
  },
  {
    name: 'SectionListScreen',
    icon: 'layers-outline',
    accessibilityLabel: 'Go to SectionList demo',
  },
  {
    name: 'LegendListScreen',
    icon: 'flash-outline',
    accessibilityLabel: 'Go to Legend List demo',
  },
  {
    name: 'CrashSyncScreen',
    icon: 'warning-outline',
    accessibilityLabel: 'Open sync crash screen',
  },
  {
    name: 'CrashAsyncScreen',
    icon: 'timer-outline',
    accessibilityLabel: 'Open async crash screen',
  },
  {
    name: 'SentryMonitorScreen',
    icon: 'analytics-outline',
    accessibilityLabel: 'Open Sentry monitor screen',
  },
  {
    name: 'SettingsScreen',
    icon: 'settings-outline',
    accessibilityLabel: 'Open settings',
  },
];

type ScreenHeaderNavProps = {
  navigation: NavigationProp<RootStackParamList>;
  current: RouteKey;
};

export function ScreenHeaderNav({ navigation, current }: ScreenHeaderNavProps) {
  return (
    <View style={styles.wrap}>
      {NAV_TARGETS.filter((t) => t.name !== current).map((t) => (
        <Pressable
          key={t.name}
          accessibilityRole="button"
          accessibilityLabel={t.accessibilityLabel}
          onPress={() => navigation.navigate(t.name)}
          style={({ pressed }) => [styles.hit, pressed && styles.hitPressed]}
        >
          <Ionicons name={t.icon} size={22} color="#2563eb" />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 4,
  },
  hit: {
    padding: 6,
    borderRadius: 8,
  },
  hitPressed: {
    opacity: 0.6,
  },
});
