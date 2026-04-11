import { LegendList } from '@legendapp/list';
import { useCallback, useMemo } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { ListItemRow } from '../components/ListItemRow';
import { ScreenSafeArea } from '../components/ScreenSafeArea';
import { buildFlatListData, type ListRowModel } from '../constants/listData';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'LegendListScreen'>;

/**
 * Legend List vs FlatList (why it often feels faster at large counts):
 *
 * - Uses a smaller, recycled pool of native views and smarter size estimation so the
 *   scroll viewport stays cheaper to lay out than FlatList's broader virtualization
 *   window in many cases.
 * - `estimatedItemSize` / `getEstimatedItemSize` let the list jump to correct offsets
 *   without measuring every row first — FlatList relies more on incremental layout.
 * - Optional `recycleItems` reuses React subtrees more aggressively than FlatList,
 *   cutting reconciliation work during fast scrolls.
 * - `drawDistance` controls off-screen pre-rendering more predictably than tuning
 *   FlatList's `windowSize` / `maxToRenderPerBatch` alone.
 *
 * Trade-offs: another dependency; some props differ from FlatList — verify behavior
 * for sticky headers, nested scroll, and platform-specific edge cases in your app.
 */
export function LegendListScreen(_props: Props) {
  const data = useMemo(() => buildFlatListData(), []);

  const renderItem = useCallback(
    ({ item }: { item: ListRowModel }) => <ListItemRow item={item} />,
    [],
  );

  const keyExtractor = useCallback((item: ListRowModel) => item.id, []);

  return (
    <ScreenSafeArea>
      <View style={styles.container}>
        <LegendList
          style={styles.list}
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentInsetAdjustmentBehavior={
            Platform.OS === 'ios' ? 'automatic' : 'never'
          }
          estimatedItemSize={56}
          recycleItems
          drawDistance={250}
        />
        <View style={styles.hint}>
          <Text style={styles.hintText}>
            Legend List: see file comments for performance notes vs FlatList.
          </Text>
        </View>
      </View>
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  list: {
    flex: 1,
  },
  hint: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#eef2ff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#c7d2fe',
  },
  hintText: {
    fontSize: 12,
    color: '#3730a3',
  },
});
