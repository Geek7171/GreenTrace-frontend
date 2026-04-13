import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  return (
    <View style={{ flex: 1, backgroundColor: '#D9F2E6', justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#2E7D32" />
    </View>
  );
}
