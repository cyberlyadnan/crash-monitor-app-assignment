import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  Divider,
  List,
  Switch,
  Text,
  useTheme,
} from 'react-native-paper';

import { ScreenContainer } from '@/components';
import { APP_NAME, spacing } from '@/constants';
import type { AppStackScreenProps } from '@/navigation';
import { useSettingsStore } from '@/store/settingsStore';
import { crashApp, crashAsync } from '@/utils/crashUtils';

type Props = AppStackScreenProps<'SettingsScreen'>;

export function SettingsScreen(_props: Props) {
  const theme = useTheme();
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = useSettingsStore((s) => s.setNotificationsEnabled);

  return (
    <ScreenContainer style={styles.screenRoot}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Settings
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Preferences and tools for {APP_NAME}.
          </Text>
        </View>

        <List.Section style={styles.section}>
          <List.Subheader style={styles.subheader}>App settings</List.Subheader>
          <Card mode="outlined" style={styles.card}>
            <List.Item
              title="Push notifications"
              description="Allow alerts and updates from the app when important events occur. You can change this anytime."
              titleNumberOfLines={2}
              descriptionNumberOfLines={4}
              left={(props) => <List.Icon {...props} icon="bell-outline" />}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  accessibilityLabel="Push notifications"
                />
              )}
            />
          </Card>
        </List.Section>

        <Divider style={styles.divider} />

        <List.Section style={styles.section}>
          <List.Subheader style={styles.subheader}>Diagnostics</List.Subheader>
          <Text variant="bodySmall" style={[styles.sectionIntro, { color: theme.colors.onSurfaceVariant }]}>
            Use these actions to verify crash reporting (for example Sentry). Only use on test devices.
          </Text>
          <Card mode="outlined" style={styles.card}>
            <Card.Content style={styles.diagnosticsContent}>
              <View style={styles.diagnosticBlock}>
                <Button
                  mode="contained-tonal"
                  buttonColor={theme.colors.errorContainer}
                  textColor={theme.colors.onErrorContainer}
                  onPress={() => crashApp()}
                  style={styles.actionButton}
                  contentStyle={styles.actionButtonContent}
                >
                  Trigger Crash
                </Button>
                <Text variant="bodySmall" style={[styles.helper, { color: theme.colors.onSurfaceVariant }]}>
                  Throws a synchronous JavaScript error immediately. Useful to confirm your error pipeline captures
                  stack traces.
                </Text>
              </View>
              <View style={styles.diagnosticBlock}>
                <Button
                  mode="contained-tonal"
                  buttonColor={theme.colors.errorContainer}
                  textColor={theme.colors.onErrorContainer}
                  onPress={() => crashAsync()}
                  style={styles.actionButton}
                  contentStyle={styles.actionButtonContent}
                >
                  Trigger Async Crash
                </Button>
                <Text variant="bodySmall" style={[styles.helper, { color: theme.colors.onSurfaceVariant }]}>
                  Creates an unhandled promise rejection so you can verify async failure handling and reporting.
                </Text>
              </View>
            </Card.Content>
          </Card>
        </List.Section>

      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    paddingHorizontal: 0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  header: {
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  headerTitle: {
    fontWeight: '600',
  },
  section: {
    marginBottom: 0,
    paddingHorizontal: 0,
  },
  subheader: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    paddingHorizontal: 0,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sectionIntro: {
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  card: {
    borderRadius: 12,
  },
  divider: {
    marginVertical: spacing.md,
  },
  diagnosticsContent: {
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  diagnosticBlock: {
    gap: spacing.sm,
  },
  actionButton: {
    borderRadius: 10,
  },
  actionButtonContent: {
    paddingVertical: spacing.xs,
  },
  helper: {
    lineHeight: 20,
  },
});
