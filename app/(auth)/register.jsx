import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { register } from '../../services/auth';
import Button from '../../components/ui/Button';
import { colors, spacing } from '../../constants/theme';

export default function Register() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setError('');

    if (!displayName.trim()) { setError('Please enter your name.'); return; }
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      await register(email, password, displayName.trim());
      router.replace('/(tabs)/home');
    } catch (e) {
      setError(e.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Image 
            source={require('../../assets/icon.png')} 
            style={{ width: 100, height: 100, borderRadius: 20 }}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Join GreenTrace🌱</Text>
        <Text style={styles.subtitle}>Create an account to track your waste</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={colors.textSecondary}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor={colors.textSecondary}
        />

        <Button label="Create Account" onPress={handleRegister} loading={loading} />

        <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.link}>
          <Text style={styles.linkText}>
            Already have an account? <Text style={{ color: colors.primary, fontWeight: '600' }}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, padding: spacing.lg, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginBottom: 28 },
  input: {
    backgroundColor: colors.white, borderRadius: 8, padding: 14,
    marginVertical: 6, fontSize: 15, color: colors.textPrimary,
    borderWidth: 1, borderColor: '#E0E0E0',
  },
  error: { color: colors.danger, fontSize: 13, marginBottom: 10 },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { fontSize: 14, color: colors.textSecondary },
});
