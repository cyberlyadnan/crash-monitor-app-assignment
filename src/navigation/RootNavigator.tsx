import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '@/screens';

import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: 'default',
        contentStyle: { backgroundColor: '#ffffff' },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Crash Monitor',
        }}
      />
    </Stack.Navigator>
  );
}
