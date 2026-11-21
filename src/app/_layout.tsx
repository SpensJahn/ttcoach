import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/lib/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="training/neu"
          options={{
            headerShown: true,
            title: 'Neues Training',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="training/[id]"
          options={{
            headerShown: true,
            title: 'Trainingsplan',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="training/[id]/drill"
          options={{
            headerShown: true,
            title: 'Übung zuordnen',
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: '#fff',
          }}
        />
      </Stack>
    </>
  );
}
