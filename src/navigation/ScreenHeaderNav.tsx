import { Ionicons } from '@expo/vector-icons';
import type { NavigationProp } from '@react-navigation/native';
import { Pressable, StyleSheet, View } from 'react-native';

import type { RootStackParamList } from '../types/navigation';

type RouteKey = keyof RootStackParamList;

const NAV_TARGETS: {
  name: RouteKey;
  icon: keyof typeof Ionicons.glyphMap;
  accessibilityLabel: string;
}[] = [
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
