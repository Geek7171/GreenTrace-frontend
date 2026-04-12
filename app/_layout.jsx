import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { View, ActivityIndicator, Image, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {});


export default function RootLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    // Hide splash screen once loading is done
    SplashScreen.hideAsync().catch(() => {});

    try {
      const inAuthGroup = segments[0] === '(auth)';
      if (!user && !inAuthGroup) {
        router.replace('/(auth)/login');
      } else if (user && inAuthGroup) {
        router.replace('/(tabs)/home');
      }
    } catch (e) {
      console.error("Navigation error:", e);
    }
  }, [user, loading, segments]);

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#D9F2E6' }}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Image 
            source={require('../assets/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: 20 }} />
          <Text style={styles.loadingText}>GreenTrace</Text>
        </View>
      ) : (
        <Stack screenOptions={{ headerShown: false }} />
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#D9F2E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 24,
  },
  loadingText: {
    marginTop: 16,
    color: '#2E7D32',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1,
  }
});