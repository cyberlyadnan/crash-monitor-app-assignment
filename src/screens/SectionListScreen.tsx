import { Ionicons } from '@expo/vector-icons';
import type { SectionListRenderItem } from 'react-native';
import { useCallback, useMemo } from 'react';
import { Platform, SectionList, StyleSheet, Text, View } from 'react-native';

import { ListItemRow } from '../components/ListItemRow';
import { ScreenSafeArea } from '../components/ScreenSafeArea';
import {
  buildSectionListData,
  type ListRowModel,
  type ListSection,
} from '../constants/listData';
import type { RootStackScreenProps } from '../types/navigation';

type Props = RootStackScreenProps<'SectionListScreen'>;

export function SectionListScreen(_props: Props) {
  const sections = useMemo(() => buildSectionListData(), []);

  const renderSectionHeader = useCallback(
    ({ section }: { section: ListSection }) => (
      <View style={styles.sectionHeader}>
        <Ionicons name="bookmark-outline" size={18} color="#1d4ed8" style={styles.sectionIcon} />
        <Text style={styles.sectionTitle}>Section {section.title}</Text>
      </View>
    ),
    [],
  );

  const renderItem = useCallback<SectionListRenderItem<ListRowModel, ListSection>>(
    ({ item }) => <ListItemRow item={item} />,
    [],
  );

  const keyExtractor = useCallback((item: ListRowModel) => item.id, []);

  return (
    <ScreenSafeArea>
      <View style={styles.container}>
        <SectionList<ListRowModel, ListSection>
          sections={sections}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={keyExtractor}
          contentInsetAdjustmentBehavior={
            Platform.OS === 'ios' ? 'automatic' : 'never'
          }
          stickySectionHeadersEnabled
          initialNumToRender={12}
          maxToRenderPerBatch={20}
          windowSize={9}
          removeClippedSubviews
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#e5e7eb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d1d5db',
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 0.5,
  },
});
