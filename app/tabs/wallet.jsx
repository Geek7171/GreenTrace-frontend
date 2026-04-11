import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { getWalletBalance, getTransactionHistory } from '../../services/rewards';
import { colors, spacing } from '../../constants/theme';

export default function Wallet() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [bal, hist] = await Promise.all([getWalletBalance(user.uid), getTransactionHistory(user.uid)]);
        setBalance(bal); setHistory(hist);
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    };
    if (user) load();
  }, [user]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  if (error) return <View style={styles.center}><Text style={{ color: colors.danger }}>{error}</Text></View>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>🌿 You have</Text>
        <Text style={styles.balanceNum}>{balance} Green Points</Text>
      </View>
      <Text style={styles.historyTitle}>Transaction History</Text>
      <FlatList
        data={history}
        keyExtractor={(item, i) => String(i)}
        renderItem={({ item }) => (
          <View style={styles.txRow}>
            <Text style={{ fontSize: 20 }}>{item.type === 'credit' ? '▲' : '▼'}</Text>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.txReason}>{item.reason}</Text>
              <Text style={styles.txDate}>{item.date}</Text>
            </View>
            <Text style={[styles.txPoints, { color: item.type === 'credit' ? colors.primary : colors.danger }]}>
              {item.type === 'credit' ? '+' : '-'}{item.points}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  balanceCard: { backgroundColor: colors.primary, borderRadius: 12, padding: 24, alignItems: 'center', marginBottom: 24 },
  balanceLabel: { color: colors.accent, fontSize: 14 },
  balanceNum: { color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 4 },
  historyTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginBottom: 10 },
  txRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, padding: 14, borderRadius: 10, marginVertical: 4 },
  txReason: { fontSize: 14, color: colors.textPrimary, fontWeight: '500' },
  txDate: { fontSize: 12, color: colors.textSecondary },
  txPoints: { fontWeight: '700', fontSize: 16 },
});