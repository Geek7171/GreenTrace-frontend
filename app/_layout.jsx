import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { View, ActivityIndicator, Image, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

export default function RootLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
  }, [user, loading, segments]);

  if (loading) return (
    <SafeAreaProvider>
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Image 
            source={require('../assets/icon.png')} 
            style={{ width: 120, height: 120, borderRadius: 24 }}
            resizeMode="contain"
          />
        </View>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    </SafeAreaProvider>
  );

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}