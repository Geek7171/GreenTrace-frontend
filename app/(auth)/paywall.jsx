import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing, borderRadius } from '../../constants/theme';
import Button from '../../components/ui/Button';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { processFinePayment } from '../../services/payment';

export default function Paywall() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Simulation/Demo Payment logic
  const handleMockPayment = async () => {
    if (!user) return;
    setLoading(true);
    
    // Simulate API delay
    setTimeout(async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          isBlocked: false,
          warningCount: 0,
          lastUnblockedAt: new Date().toISOString(),
        });
        setLoading(false);
        Alert.alert("Demo Success", "This was a simulation. Account unblocked.", [
          { text: "OK", onPress: () => router.replace('/(tabs)/home') }
        ]);
      } catch (e) {
        setLoading(false);
        Alert.alert("Error", e.message);
      }
    }, 1500);
  };

  // Real Razorpay Payment logic
  const handleRealPayment = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const paymentResponse = await processFinePayment(
        100, 
        user.email, 
        user.displayName || 'GreenTrace User'
      );

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        isBlocked: false,
        warningCount: 0,
        lastUnblockedAt: new Date().toISOString(),
        lastPaymentId: paymentResponse.razorpay_payment_id
      });

      setLoading(false);
      Alert.alert("Real Payment Success", "Your fine has been paid via Razorpay.", [
        { text: "Continue", onPress: () => router.replace('/(tabs)/home') }
      ]);
    } catch (e) {
      setLoading(false);
      const errorMsg = e.description || e.message || "Payment cancelled";
      if (errorMsg !== "Payment cancelled") {
        Alert.alert("Payment Failed", errorMsg);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="alert-octagon" size={90} color={colors.danger} />
        </View>
        
        <Text style={styles.title}>Account Blocked</Text>
        <Text style={styles.subtitle}>
          Your account has been suspended due to reaching the maximum of 3 warnings for rejected waste submissions.
        </Text>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Status</Text>
            <Text style={[styles.infoValue, { color: colors.danger }]}>Blocked (3/3)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fine Amount</Text>
            <Text style={styles.infoValue}>₹100.00</Text>
          </View>
        </View>

        <Text style={styles.footerText}>
          To resume using GreenTrace, please pay the fine using one of the methods below.
        </Text>

        <View style={styles.buttonContainer}>
          {loading ? (
            <View style={styles.processing}>
              <ActivityIndicator color={colors.danger} size="small" />
              <Text style={styles.processingText}>Processing...</Text>
            </View>
          ) : (
            <>
              <Button 
                label="Demo Payment (Simulation) 🧪" 
                onPress={handleMockPayment}
                variant="secondary"
                style={{ marginBottom: spacing.md }}
              />
              <Button 
                label="Real Payment (Razorpay) 💳" 
                onPress={handleRealPayment}
                variant="danger"
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF5F5' },
  content: { flex: 1, padding: spacing.xl, justifyContent: 'center', alignItems: 'center' },
  iconContainer: { marginBottom: spacing.lg },
  title: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm },
  subtitle: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: spacing.xl },
  infoBox: { width: '100%', backgroundColor: colors.white, borderRadius: borderRadius.card, padding: spacing.lg, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, marginBottom: spacing.xl },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm },
  infoLabel: { fontSize: 16, color: colors.textSecondary },
  infoValue: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: spacing.xs },
  footerText: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: spacing.xl },
  buttonContainer: { width: '100%' },
  processing: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: spacing.md },
  processingText: { marginLeft: 10, color: colors.danger, fontWeight: '600' }
});
