import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

import { CrashAsyncScreen } from '../screens/CrashAsyncScreen';
import { CrashSyncScreen } from '../screens/CrashSyncScreen';
import { FlatListScreen } from '../screens/FlatListScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SentryIssueDetailScreen } from '../screens/SentryIssueDetailScreen';
import { LegendListScreen } from '../screens/LegendListScreen';
import { SentryMonitorScreen } from '../screens/SentryMonitorScreen';
import { SectionListScreen } from '../screens/SectionListScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import type { RootStackParamList } from '../types/navigation';
import { ScreenHeaderNav } from './ScreenHeaderNav';

const Stack = createNativeStackNavigator<RootStackParamList>();

const SCREEN_TITLES: Record<keyof RootStackParamList, string> = {
  HomeScreen: 'Home',
  FlatListScreen: 'FlatList',
  SectionListScreen: 'SectionList',
  LegendListScreen: 'Legend List',
  CrashSyncScreen: 'Crash Screen 1',
  CrashAsyncScreen: 'Crash Screen 2',
  SentryMonitorScreen: 'Sentry Monitor',
  SentryIssueDetailScreen: 'Issue Details',
  SettingsScreen: 'Settings',
};

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
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
        name="HomeScreen"
        component={HomeScreen}
        options={({ navigation, route }) => ({
          title: SCREEN_TITLES.HomeScreen,
          headerRight: () => (
            <ScreenHeaderNav navigation={navigation} current={route.name} />
          ),
        })}
      />
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
        name="CrashSyncScreen"
        component={CrashSyncScreen}
        options={({ navigation, route }) => ({
          title: SCREEN_TITLES.CrashSyncScreen,
          headerRight: () => (
            <ScreenHeaderNav navigation={navigation} current={route.name} />
          ),
        })}
      />
      <Stack.Screen
        name="CrashAsyncScreen"
        component={CrashAsyncScreen}
        options={({ navigation, route }) => ({
          title: SCREEN_TITLES.CrashAsyncScreen,
          headerRight: () => (
            <ScreenHeaderNav navigation={navigation} current={route.name} />
          ),
        })}
      />
      <Stack.Screen
        name="SentryMonitorScreen"
        component={SentryMonitorScreen}
        options={({ navigation, route }) => ({
          title: SCREEN_TITLES.SentryMonitorScreen,
          headerRight: () => (
            <ScreenHeaderNav navigation={navigation} current={route.name} />
          ),
        })}
      />
      <Stack.Screen
        name="SentryIssueDetailScreen"
        component={SentryIssueDetailScreen}
        options={({ navigation, route }) => ({
          title: SCREEN_TITLES.SentryIssueDetailScreen,
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
