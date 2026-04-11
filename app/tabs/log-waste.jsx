import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import WasteCategoryPicker from '../../components/WasteCategoryPicker';
import { colors, spacing } from '../../constants/theme';

export default function LogWaste() {
  const router = useRouter();
  const handleSelect = (category) => {
    router.push({ pathname: '/camera', params: { categoryId: category.id, categoryLabel: category.label } });
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>What are you disposing today?</Text>
      <WasteCategoryPicker onSelect={handleSelect} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  heading: { fontSize: 20, fontWeight: '700', color: colors.textPrimary, marginTop: 20, marginBottom: 16 },
});