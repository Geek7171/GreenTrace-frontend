import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCamera } from '../hooks/useCamera';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from '../hooks/useLocation';
import { submitWasteLog } from '../services/wasteLog';
import { colors } from '../constants/theme';

export default function Camera() {
  const { categoryLabel, categoryId } = useLocalSearchParams();
  const { photo, takePhoto, clearPhoto, cameraRef } = useCamera();
  const { user } = useAuth();
  const { getLocation } = useLocation();
  const [permission, requestPermission] = useCameraPermissions();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permText}>Camera access needed</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}><Text style={styles.btnText}>Grant Permission</Text></TouchableOpacity>
      </View>
    );
  }

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const coords = await getLocation();
      await submitWasteLog({ userId: user.uid, category: categoryId, photoUrl: photo.uri, geoLocation: coords });
      Alert.alert('Submitted! Pending review 🎉');
      router.replace('/(tabs)/home');
    } catch (e) {
      Alert.alert('Error', e.message || 'Submission failed');
    } finally { setSubmitting(false); }
  };

  if (photo) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photo.uri }} style={styles.preview} />
        {submitting
          ? <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
          : (
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={handleSubmit}><Text style={styles.btnText}>✅ Use this photo</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: '#888' }]} onPress={clearPhoto}><Text style={styles.btnText}>🔄 Retake</Text></TouchableOpacity>
            </View>
          )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>📸 Photographing: {categoryLabel}</Text>
      <CameraView style={styles.camera} ref={cameraRef} />
      <TouchableOpacity style={styles.captureBtn} onPress={takePhoto} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  camera: { flex: 1 },
  label: { color: '#fff', textAlign: 'center', padding: 16, fontSize: 16, fontWeight: '600', backgroundColor: 'rgba(0,0,0,0.5)' },
  captureBtn: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#fff', alignSelf: 'center', marginBottom: 40, borderWidth: 4, borderColor: colors.primary },
  preview: { flex: 1 },
  actions: { padding: 24, gap: 12 },
  btn: { padding: 14, borderRadius: 8, alignItems: 'center', marginVertical: 4 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  permText: { fontSize: 16, marginBottom: 16, color: colors.textPrimary },
});