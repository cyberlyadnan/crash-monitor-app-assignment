import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AppStackParamList = {
  FlatListScreen: undefined;
  SectionListScreen: undefined;
  LegendListScreen: undefined;
  SettingsScreen: undefined;
};

export type AppStackScreenProps<Screen extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  Screen
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppStackParamList {}
  }
}
