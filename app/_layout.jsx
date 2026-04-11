import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '../constants/theme';

export default function RootLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;
    const inAuth = segments[0] === '(auth)';
    if (!user && !inAuth) router.replace('/(auth)/login');
    if (user && inAuth) router.replace('/(tabs)/home');
  }, [user, loading]);

  if (loading) return <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}><ActivityIndicator color={colors.primary} size="large" /></View>;

  return <Stack screenOptions={{ headerShown: false }} />;
}