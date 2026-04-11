import type { MD3Theme } from 'react-native-paper';
import { MD3LightTheme } from 'react-native-paper';

import { colors } from '@/constants';

/**
 * Material Design 3 theme aligned with app brand colors.
 */
export const paperTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.tint,
    primaryContainer: '#dbeafe',
    onPrimary: '#ffffff',
    onPrimaryContainer: '#1e3a8a',
    surface: colors.background,
    surfaceVariant: '#f3f4f6',
    onSurface: colors.textPrimary,
    onSurfaceVariant: colors.textSecondary,
    outline: '#e5e7eb',
    outlineVariant: '#f3f4f6',
    error: '#b91c1c',
    onError: '#ffffff',
  },
};
