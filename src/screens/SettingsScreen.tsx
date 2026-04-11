import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components';
import { APP_NAME, colors, spacing } from '@/constants';
import type { AppStackScreenProps } from '@/navigation';
import { crashApp, crashAsync } from '@/utils/crashUtils';

type Props = AppStackScreenProps<'SettingsScreen'>;

export function SettingsScreen({ navigation }: Props) {
  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>{APP_NAME}</Text>
      <Text style={styles.body}>Navigation is typed via AppStackParamList.</Text>

      <View style={styles.actions}>
        <Pressable
          onPress={() => navigation.navigate('FlatListScreen')}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonLabel}>Open flat list</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate('LegendListScreen')}
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          <Text style={styles.buttonLabel}>Open legend list</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionLabel}>Sentry diagnostics</Text>
      <Text style={styles.sectionHint}>
        Triggers a JS exception and an unhandled rejection so you can confirm events in Sentry (valid DSN
        required).
      </Text>
      <View style={styles.dangerActions}>
        <Pressable
          onPress={() => crashApp()}
          style={({ pressed }) => [styles.dangerButton, pressed && styles.dangerButtonPressed]}
        >
          <Text style={styles.dangerButtonLabel}>Throw sync error</Text>
        </Pressable>
        <Pressable
          onPress={() => crashAsync()}
          style={({ pressed }) => [styles.dangerButton, pressed && styles.dangerButtonPressed]}
        >
          <Text style={styles.dangerButtonLabel}>Unhandled rejection</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  actions: {
    gap: spacing.sm,
  },
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    backgroundColor: `${colors.tint}18`,
    borderWidth: 1,
    borderColor: `${colors.tint}55`,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.tint,
    textAlign: 'center',
  },
  sectionLabel: {
    marginTop: spacing.xl,
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.xs,
  },
  sectionHint: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  dangerActions: {
    gap: spacing.sm,
  },
  dangerButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  dangerButtonPressed: {
    opacity: 0.92,
  },
  dangerButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#b91c1c',
    textAlign: 'center',
  },
});
