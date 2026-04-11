import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

export default function PointsBadge({ points }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>🌿 {points} pts</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { backgroundColor: colors.primary, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  text: { color: colors.white, fontSize: 12, fontWeight: '600' },
});