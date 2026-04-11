import { StyleSheet, Text } from 'react-native';

import { ScreenContainer } from '@/components';
import { colors, spacing } from '@/constants';
import type { RootStackScreenProps } from '@/navigation';

type Props = RootStackScreenProps<'Home'>;

export function HomeScreen(_props: Props) {
  return (
    <ScreenContainer style={styles.centered}>
      <Text style={styles.title}>CrashMonitorApp</Text>
      <Text style={styles.subtitle}>React Navigation is wired up. Add screens under src/screens.</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 22,
  },
});
