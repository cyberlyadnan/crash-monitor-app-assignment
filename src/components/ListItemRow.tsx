import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { ListRowModel } from '../constants/listData';

type ListItemRowProps = {
  item: ListRowModel;
};

function ListItemRowComponent({ item }: ListItemRowProps) {
  return (
    <View style={styles.row}>
      <Ionicons name={item.iconName} size={22} color="#2563eb" style={styles.icon} />
      <Text style={styles.label}>Item {item.ordinal}</Text>
    </View>
  );
}

export const ListItemRow = memo(ListItemRowComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    color: '#111827',
  },
});
