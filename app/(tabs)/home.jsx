import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { getWalletBalance } from '../../services/rewards';
import { getTodaySubmissions } from '../../services/wasteLog';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/card';
import SubmissionStatus from '../../components/SubmissionStatus';
import PointsBadge from '../../components/ui/PointsBadge';
import { colors, spacing } from '../../constants/theme';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const name = user?.displayName || 'there';

  const [balance, setBalance] = useState(null);
  const [todaySubmissions, setTodaySubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [bal, subs] = await Promise.all([
          getWalletBalance(user.uid),
          getTodaySubmissions(user.uid),
        ]);
        setBalance(bal);
        setTodaySubmissions(subs);
      } catch (e) {
        console.warn('Home load error:', e.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) load();
  }, [user]);

  const latestSubmission = todaySubmissions.length > 0 ? todaySubmissions[0] : null;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning, {name} 👋</Text>
        {balance !== null && <PointsBadge points={balance} />}
      </View>

      <Card style={styles.statusCard}>
        <Text style={styles.statusLabel}>Today's Submission</Text>
        {latestSubmission ? (
          <View>
            <SubmissionStatus status={latestSubmission.status} />
            <Text style={styles.statusDetail}>
              {latestSubmission.category} • {latestSubmission.pointsAwarded > 0 ? `+${latestSubmission.pointsAwarded} pts` : 'Awaiting review'}
            </Text>
          </View>
        ) : (
          <Text style={styles.statusText}>No log yet today</Text>
        )}
      </Card>

      <Button label="Log Today's Waste ♻️" onPress={() => router.push('/(tabs)/log-waste')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 20 },
  greeting: { fontSize: 22, fontWeight: '700', color: colors.textPrimary, flex: 1 },
  statusCard: { backgroundColor: '#E8F5E9', marginBottom: 20 },
  statusLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 6 },
  statusText: { fontSize: 16, color: colors.textPrimary, fontWeight: '500' },
  statusDetail: { fontSize: 13, color: colors.textSecondary, marginTop: 6 },
});