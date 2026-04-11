import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/button';
import Card from '../../components/ui/card';
import { colors, spacing } from '../../constants/theme';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const name = user?.displayName || 'there';

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.greeting}>Good morning, {name} 👋</Text>
      <Card style={styles.statusCard}>
        <Text style={styles.statusLabel}>Today's Submission</Text>
        <Text style={styles.statusText}>No log yet today</Text>
      </Card>
      <Button label="Log Today's Waste ♻️" onPress={() => router.push('/(tabs)/log-waste')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  greeting: { fontSize: 22, fontWeight: '700', color: colors.textPrimary, marginTop: 20, marginBottom: 20 },
  statusCard: { backgroundColor: '#E8F5E9', marginBottom: 20 },
  statusLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 6 },
  statusText: { fontSize: 16, color: colors.textPrimary, fontWeight: '500' },
});