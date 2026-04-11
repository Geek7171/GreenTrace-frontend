import { View, Text, StyleSheet } from 'react-native';

const config = {
  pending:  { bg: '#FFF8E1', color: '#F57F17', label: '⏳ Pending Review' },
  approved: { bg: '#E8F5E9', color: '#2E7D32', label: '✅ Approved' },
  rejected: { bg: '#FFEBEE', color: '#C62828', label: '❌ Rejected' },
};

export default function SubmissionStatus({ status }) {
  const c = config[status] || config.pending;
  return (
    <View style={[styles.pill, { backgroundColor: c.bg }]}>
      <Text style={[styles.text, { color: c.color }]}>{c.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start' },
  text: { fontWeight: '600', fontSize: 13 },
});