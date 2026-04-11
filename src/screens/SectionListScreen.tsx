import { SectionList, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components';
import { colors, spacing } from '@/constants';
import type { AppStackScreenProps } from '@/navigation';

const SECTIONS = [
  {
    title: 'Group A',
    data: ['Alpha', 'Amber', 'Atlas'],
  },
  {
    title: 'Group B',
    data: ['Bravo', 'Beta', 'Blaze'],
  },
  {
    title: 'Group C',
    data: ['Charlie', 'Cedar', 'Cove'],
  },
];

type Props = AppStackScreenProps<'SectionListScreen'>;

export function SectionListScreen(_props: Props) {
  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.hint}>Sectioned rows for grouped content.</Text>
      <SectionList
        sections={SECTIONS}
        keyExtractor={(item, index) => `${item}-${index}`}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowTitle}>{item}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled
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
  sectionHeader: {
    backgroundColor: '#f3f4f6',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 6,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
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
