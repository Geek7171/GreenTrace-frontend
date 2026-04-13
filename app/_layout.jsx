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
  const router = useRouter();
  const segments = useSegments();
  
  let authData;
  try {
    authData = useAuth();
  } catch (e) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Configuration Error</Text>
        <Text style={styles.errorText}>{e.message}</Text>
        <Text style={styles.errorSubText}>Please ensure your environment variables are correctly set and the app is rebuilt.</Text>
      </View>
    );
  }

  const { user, loading } = authData;

  useEffect(() => {
    if (loading) return;

    // Hide splash screen once loading is done
    SplashScreen.hideAsync().catch(() => {});

    try {
      const inAuthGroup = segments[0] === '(auth)';
      const isAtRoot = !segments || segments.length === 0 || segments[0] === 'index';

      if (!user) {
        // If not logged in and not in auth group, or at root -> go to login
        if (!inAuthGroup || isAtRoot) {
          router.replace('/(auth)/login');
        }
      } else {
        // If logged in and in auth group, or at root -> go to home
        if (inAuthGroup || isAtRoot) {
          router.replace('/(tabs)/home');
        }
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
  errorContainer: {
    flex: 1,
    backgroundColor: '#FFF1F1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#D32F2F',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
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