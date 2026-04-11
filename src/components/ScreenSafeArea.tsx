import type { ReactNode } from 'react';
import { StyleSheet, type ViewStyle } from 'react-native';
import type { Edge } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenSafeAreaProps = {
  children: ReactNode;
  /**
   * Which edges respect safe area. For native-stack screens with a header, omit `top` so we
   * do not double-apply window top inset (which can make lists overlap or lay out wrong).
   * The stack + status bar handle the top; we keep bottom + horizontal for home indicator / notches.
   */
  edges?: readonly Edge[];
  style?: ViewStyle;
};

const DEFAULT_EDGES: readonly Edge[] = ['bottom', 'left', 'right'];

export function ScreenSafeArea({
  children,
  edges = DEFAULT_EDGES,
  style,
}: ScreenSafeAreaProps) {
  return (
    <SafeAreaView style={[styles.fill, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
});
