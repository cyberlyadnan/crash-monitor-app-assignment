import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components';
import { colors, spacing } from '@/constants';
import type { AppStackScreenProps } from '@/navigation';

/** Placeholder rows; swap in Legend List or another virtualized list when needed. */
const ROWS = Array.from({ length: 32 }, (_, i) => ({
  id: `legend-${i + 1}`,
  label: `Legend row ${i + 1}`,
}));

type Props = AppStackScreenProps<'LegendListScreen'>;

export function LegendListScreen(_props: Props) {
  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.hint}>
        Virtualized list screen — ready for Legend List or similar.
      </Text>
      <FlatList
        data={ROWS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowTitle}>{item.label}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
  },
  hint: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
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
