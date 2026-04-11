import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { wasteCategories } from '../constants/wasteCategories';
import { colors, borderRadius, spacing } from '../constants/theme';

export default function WasteCategoryPicker({ onSelect }) {
  return (
    <View>
      {wasteCategories.map(cat => (
        <TouchableOpacity key={cat.id} style={[styles.card, { borderLeftColor: cat.color }]} onPress={() => onSelect(cat)}>
          <Text style={styles.emoji}>{cat.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{cat.label}</Text>
            <Text style={styles.pts}>+{cat.points} points</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: borderRadius.card, padding: 16, marginVertical: 8, flexDirection: 'row', alignItems: 'center', borderLeftWidth: 5, elevation: 2 },
  emoji: { fontSize: 28, marginRight: 14 },
  label: { fontSize: 17, fontWeight: '600', color: colors.textPrimary },
  pts: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
});