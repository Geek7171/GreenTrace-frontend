import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../../constants/theme';

export default function Button({ label, onPress, variant = 'primary', loading = false }) {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  return (
    <TouchableOpacity
      style={[styles.base, isPrimary && styles.primary, !isPrimary && !isDanger && styles.secondary, isDanger && styles.danger]}
      onPress={onPress} disabled={loading}
    >
      {loading
        ? <ActivityIndicator color={isPrimary ? colors.white : colors.primary} />
        : <Text style={[styles.text, !isPrimary && styles.textOutline]}>{label}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { padding: 14, borderRadius: borderRadius.button, alignItems: 'center', marginVertical: 6 },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.primary },
  danger: { backgroundColor: colors.danger },
  text: { color: colors.white, fontWeight: '600', fontSize: 16 },
  textOutline: { color: colors.primary },
});