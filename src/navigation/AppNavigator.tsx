import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  FlatListScreen,
  LegendListScreen,
  SectionListScreen,
  SettingsScreen,
} from '@/screens';

import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

const screenOptions = {
  headerShown: true,
  animation: 'default' as const,
  contentStyle: { backgroundColor: '#ffffff' },
};

export function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="FlatListScreen" screenOptions={screenOptions}>
      <Stack.Screen
        name="FlatListScreen"
        component={FlatListScreen}
        options={{ title: 'Flat list' }}
      />
      <Stack.Screen
        name="SectionListScreen"
        component={SectionListScreen}
        options={{ title: 'Section list' }}
      />
      <Stack.Screen
        name="LegendListScreen"
        component={LegendListScreen}
        options={{ title: 'Legend list' }}
      />
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
}
