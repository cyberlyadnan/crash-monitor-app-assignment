import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  FlatListScreen: undefined;
  SectionListScreen: undefined;
  LegendListScreen: undefined;
  SettingsScreen: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
