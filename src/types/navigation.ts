import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  HomeScreen: undefined;
  FlatListScreen: undefined;
  SectionListScreen: undefined;
  LegendListScreen: undefined;
  CrashSyncScreen: undefined;
  CrashAsyncScreen: undefined;
  SettingsScreen: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
