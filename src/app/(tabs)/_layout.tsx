import { Tabs } from 'expo-router';
import { colors } from '@/lib/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Übersicht' }} />
      <Tabs.Screen name="spieler" options={{ title: 'Spieler' }} />
      <Tabs.Screen name="uebungen" options={{ title: 'Übungen' }} />
      <Tabs.Screen name="training" options={{ title: 'Trainings' }} />
    </Tabs>
  );
}
