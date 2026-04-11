import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '../../services/auth';
import Button from '../../components/ui/button';
import { colors, spacing } from '../../constants/theme';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError(''); setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)/home');
    } catch (e) {
      setError(e.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.title}>Welcome Back 🌿</Text>
      <Text style={styles.subtitle}>Sign in to track your waste</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={colors.textSecondary} />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor={colors.textSecondary} />
      <Button label="Login" onPress={handleLogin} loading={loading} />
      <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.link}>
        <Text style={styles.linkText}>Don't have an account? <Text style={{ color: colors.primary, fontWeight: '600' }}>Register</Text></Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginBottom: 28 },
  input: { backgroundColor: colors.white, borderRadius: 8, padding: 14, marginVertical: 6, fontSize: 15, color: colors.textPrimary, borderWidth: 1, borderColor: '#E0E0E0' },
  error: { color: colors.danger, fontSize: 13, marginBottom: 10 },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { fontSize: 14, color: colors.textSecondary },
});