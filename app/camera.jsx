import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert, Switch, ScrollView } from 'react-native';
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
  const [checklist, setChecklist] = useState({
    wetSeparated: false,
    drySeparated: false,
    hazardFree: false,
  });
  const router = useRouter();

  const toggleChecklist = (key) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!permission?.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permText}>Camera access needed</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}><Text style={styles.btnText}>Grant Permission</Text></TouchableOpacity>
      </View>
    );
  }

  const handleSubmit = async () => {
    // Validate checklist — all items must be checked
    const allChecked = checklist.wetSeparated && checklist.drySeparated && checklist.hazardFree;
    if (!allChecked) {
      Alert.alert('Checklist Incomplete', 'Please confirm all segregation items before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const coords = await getLocation();
      if (!coords) {
        Alert.alert('Location Required', 'Please enable location access to submit.');
        setSubmitting(false);
        return;
      }

      await submitWasteLog({
        uid: user.uid,
        category: categoryId,
        photoBase64: photo.base64,
        gps: coords,
        checklist,
      });

      Alert.alert('Success!', 'Submission sent. Pending review 🎉');
      router.replace('/(tabs)/home');
    } catch (e) {
      Alert.alert('Error', e.message || 'Submission failed');
    } finally { setSubmitting(false); }
  };

  if (photo) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
        <Image source={{ uri: photo.uri }} style={styles.preview} />

        {/* Segregation Checklist */}
        <View style={styles.checklistContainer}>
          <Text style={styles.checklistTitle}>✅ Segregation Checklist</Text>

          <View style={styles.checkItem}>
            <Text style={styles.checkLabel}>Wet waste separated properly</Text>
            <Switch
              value={checklist.wetSeparated}
              onValueChange={() => toggleChecklist('wetSeparated')}
              trackColor={{ false: '#ccc', true: colors.accent }}
              thumbColor={checklist.wetSeparated ? colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.checkItem}>
            <Text style={styles.checkLabel}>Dry waste separated properly</Text>
            <Switch
              value={checklist.drySeparated}
              onValueChange={() => toggleChecklist('drySeparated')}
              trackColor={{ false: '#ccc', true: colors.accent }}
              thumbColor={checklist.drySeparated ? colors.primary : '#f4f3f4'}
            />
          </View>

          <View style={styles.checkItem}>
            <Text style={styles.checkLabel}>No hazardous materials mixed</Text>
            <Switch
              value={checklist.hazardFree}
              onValueChange={() => toggleChecklist('hazardFree')}
              trackColor={{ false: '#ccc', true: colors.accent }}
              thumbColor={checklist.hazardFree ? colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        {submitting
          ? <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
          : (
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primary }]} onPress={handleSubmit}><Text style={styles.btnText}>✅ Submit</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btn, { backgroundColor: '#888' }]} onPress={clearPhoto}><Text style={styles.btnText}>🔄 Retake</Text></TouchableOpacity>
            </View>
          )}
      </ScrollView>
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
  preview: { width: '100%', height: 300 },
  checklistContainer: { backgroundColor: '#1a1a1a', padding: 16, borderRadius: 12, margin: 16 },
  checklistTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 12 },
  checkItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#333' },
  checkLabel: { color: '#ddd', fontSize: 14, flex: 1, marginRight: 12 },
  actions: { padding: 24, gap: 12 },
  btn: { padding: 14, borderRadius: 8, alignItems: 'center', marginVertical: 4 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  permText: { fontSize: 16, marginBottom: 16, color: colors.textPrimary },
});