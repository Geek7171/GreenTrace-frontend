import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { getTopUsers, getUserRank } from '../../services/leaderboard';
import LeaderboardItem from '../../components/LeaderboardItem';
import { colors, spacing } from '../../constants/theme';

export default function Leaderboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [top, rank] = await Promise.all([getTopUsers(20), getUserRank(user.uid)]);
        setUsers(top); setMyRank(rank);
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    };
    if (user) load();
  }, [user]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  if (error) return <View style={styles.center}><Text style={{ color: colors.danger }}>{error}</Text></View>;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>🏆 Green Champions</Text>
      {myRank && <Text style={styles.myRank}>Your rank: #{myRank}</Text>}
      {users.length === 0 ? (
        <View style={styles.center}>
          <Text style={{ color: colors.textSecondary }}>No leaderboard data yet</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.userId}
          renderItem={({ item, index }) => (
            <LeaderboardItem
              rank={index + 1}
              name={item.name}
              buildingId={item.buildingId}
              points={item.points}
              streak={item.streak}
              isCurrentUser={item.userId === user?.uid}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 22, fontWeight: '700', color: colors.textPrimary, marginTop: 20, marginBottom: 4 },
  myRank: { fontSize: 14, color: colors.textSecondary, marginBottom: 16 },
});