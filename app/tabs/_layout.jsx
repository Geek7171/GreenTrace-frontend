import { Tabs } from 'expo-router';
import { colors } from '../../constants/theme';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.textSecondary }}>
      <Tabs.Screen name="home" options={{ title: 'Home', tabBarIcon: () => null }} />
      <Tabs.Screen name="log-waste" options={{ title: 'Log', tabBarIcon: () => null }} />
      <Tabs.Screen name="wallet" options={{ title: 'Wallet', tabBarIcon: () => null }} />
      <Tabs.Screen name="leaderboard" options={{ title: 'Leaderboard', tabBarIcon: () => null }} />
    </Tabs>
  );
}