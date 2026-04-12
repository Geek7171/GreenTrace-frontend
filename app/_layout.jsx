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
      <View style={styles.loadingContainer}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../assets/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
            onLoadError={() => console.log('Logo load failed')}
          />
        </View>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.loadingText}>Loading GreenTrace...</Text>
      </View>
    </SafeAreaProvider>
  );

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 40,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 30,
  },
  loadingText: {
    marginTop: 20,
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
  }
});