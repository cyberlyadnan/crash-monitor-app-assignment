import type { ListRenderItem } from 'react-native';
import { useCallback, useMemo } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';

import { ListItemRow } from '../components/ListItemRow';
import { ScreenSafeArea } from '../components/ScreenSafeArea';
import { buildFlatListData, type ListRowModel } from '../constants/listData';
import type { RootStackScreenProps } from '../types/navigation';

/** Matches row padding + icon + hairline; enables O(1) scroll jumps when used with getItemLayout. */
const ROW_HEIGHT = 56;

type Props = RootStackScreenProps<'FlatListScreen'>;

export function FlatListScreen(_props: Props) {
  const data = useMemo(() => buildFlatListData(), []);

  const renderItem = useCallback<ListRenderItem<ListRowModel>>(
    ({ item }) => <ListItemRow item={item} />,
    [],
  );

  const keyExtractor = useCallback((item: ListRowModel) => item.id, []);

  const getItemLayout = useCallback(
    (_data: ArrayLike<ListRowModel> | null | undefined, index: number) => ({
      length: ROW_HEIGHT,
      offset: ROW_HEIGHT * index,
      index,
    }),
    [],
  );

  return (
    <ScreenSafeArea>
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          contentInsetAdjustmentBehavior={
            Platform.OS === 'ios' ? 'automatic' : 'never'
          }
          initialNumToRender={16}
          maxToRenderPerBatch={24}
          windowSize={7}
          removeClippedSubviews
          updateCellsBatchingPeriod={50}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenSafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
});
