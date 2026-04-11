import { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components';
import { colors, spacing } from '@/constants';
import type { AppStackScreenProps } from '@/navigation';

const ROWS = Array.from({ length: 24 }, (_, i) => ({
  id: String(i + 1),
  title: `Item ${i + 1}`,
}));

type Props = AppStackScreenProps<'FlatListScreen'>;

export function FlatListScreen({ navigation }: Props) {
  const renderItem = useCallback(
    ({ item }: { item: (typeof ROWS)[number] }) => (
      <View style={styles.row}>
        <Text style={styles.rowTitle}>{item.title}</Text>
      </View>
    ),
    [],
  );

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.toolbar}>
        <Pressable
          onPress={() => navigation.navigate('SectionListScreen')}
          style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}
        >
          <Text style={styles.linkText}>Section list</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('SettingsScreen')}
          style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}
        >
          <Text style={styles.linkText}>Settings</Text>
        </Pressable>
      </View>
      <FlatList
        data={ROWS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
  },
  toolbar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  link: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
    backgroundColor: `${colors.tint}14`,
  },
  linkPressed: {
    opacity: 0.85,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.tint,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  row: {
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
  rowTitle: {
    fontSize: 16,
    color: colors.textPrimary,
  },
});
