import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components';
import { APP_NAME, colors, spacing } from '@/constants';
import type { AppStackScreenProps } from '@/navigation';

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
});
