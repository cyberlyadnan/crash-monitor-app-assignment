import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

import { FlatListScreen } from '../screens/FlatListScreen';
import { LegendListScreen } from '../screens/LegendListScreen';
import { SectionListScreen } from '../screens/SectionListScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import type { RootStackParamList } from '../types/navigation';
import { ScreenHeaderNav } from './ScreenHeaderNav';

const Stack = createNativeStackNavigator<RootStackParamList>();

const SCREEN_TITLES: Record<keyof RootStackParamList, string> = {
  FlatListScreen: 'FlatList',
  SectionListScreen: 'SectionList',
  LegendListScreen: 'Legend List',
  SettingsScreen: 'Settings',
};

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="FlatListScreen"
      screenOptions={{
        headerShown: true,
        headerTransparent: false,
        headerShadowVisible: true,
        headerTitleStyle: { fontWeight: '600' },
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        contentStyle: {
          flex: 1,
          backgroundColor: '#f3f4f6',
        },
        ...(Platform.OS === 'android'
          ? { statusBarTranslucent: false, statusBarBackgroundColor: '#ffffff' }
          : null),
      }}
    >
      <Stack.Screen
        name="FlatListScreen"
        component={FlatListScreen}
        options={({ navigation, route }) => ({
          title: SCREEN_TITLES.FlatListScreen,
          headerRight: () => (
            <ScreenHeaderNav navigation={navigation} current={route.name} />
          ),
        })}
      />
      <Stack.Screen
        name="SectionListScreen"
        component={SectionListScreen}
        options={({ navigation, route }) => ({
          title: SCREEN_TITLES.SectionListScreen,
          headerRight: () => (
            <ScreenHeaderNav navigation={navigation} current={route.name} />
          ),
        })}
      />
      <Stack.Screen
        name="LegendListScreen"
        component={LegendListScreen}
        options={({ navigation, route }) => ({
          title: SCREEN_TITLES.LegendListScreen,
          headerRight: () => (
            <ScreenHeaderNav navigation={navigation} current={route.name} />
          ),
        })}
      />
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={({ navigation, route }) => ({
          title: SCREEN_TITLES.SettingsScreen,
          headerRight: () => (
            <ScreenHeaderNav navigation={navigation} current={route.name} />
          ),
        })}
      />
    </Stack.Navigator>
  );
}
