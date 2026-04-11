import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

const medals = ['🥇', '🥈', '🥉'];

export default function LeaderboardItem({ rank, name, building, points, isCurrentUser }) {
  return (
    <View style={[styles.row, isCurrentUser && styles.highlighted]}>
      <Text style={styles.rank}>{medals[rank - 1] || `#${rank}`}</Text>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.building}>{building}</Text>
      </View>
      <Text style={styles.points}>{points} pts</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: colors.white, borderRadius: 10, marginVertical: 4 },
  highlighted: { backgroundColor: '#E8F5E9', borderWidth: 1, borderColor: colors.accent },
  rank: { fontSize: 20, width: 40 },
  name: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  building: { fontSize: 12, color: colors.textSecondary },
  points: { fontWeight: '700', color: colors.primary },
});