import { View, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../../constants/theme';

export default function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white, borderRadius: borderRadius.card,
    padding: 16, shadowColor: '#000', shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 3,
  },
});