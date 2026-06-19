import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../store/useStore';
import { colors, fontSize, spacing, radius } from '../../theme';

export function LoginScreen() {
  const login = useStore(s => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    const ok = await login(email.trim(), password);
    setLoading(false);
    if (!ok) {
      Alert.alert('Login failed', 'Invalid credentials. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.inner}>
          {/* Logo */}
          <View style={styles.logoRow}>
            <Text style={styles.logoOn}>ON</Text>
            <Text style={styles.logoBoard}>BOARD</Text>
          </View>
          <Text style={styles.tagline}>Find your table. Play your game.</Text>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="mail-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeBtn}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginBtnText}>Log In</Text>
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.footerNote}>
            Don't have an account?{' '}
            <Text style={styles.footerLink}>Sign up</Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  logoOn: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 40,
    color: colors.logoPurple,
    letterSpacing: 2,
  },
  logoBoard: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 40,
    color: colors.logoMuted,
    letterSpacing: 2,
  },
  tagline: {
    fontFamily: 'Poppins_400Regular',
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.xxxl + spacing.lg,
  },
  form: {
    gap: spacing.lg,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    fontFamily: 'Poppins_500Medium',
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    height: 48,
    fontFamily: 'Poppins_400Regular',
    fontSize: fontSize.md,
    color: colors.textPrimary,
  },
  eyeBtn: {
    padding: spacing.xs,
  },
  loginBtn: {
    height: 50,
    backgroundColor: colors.brand,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    shadowColor: colors.brand,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  loginBtnDisabled: {
    opacity: 0.6,
  },
  loginBtnText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: fontSize.lg,
    color: '#fff',
  },
  footerNote: {
    marginTop: spacing.xxl,
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  footerLink: {
    color: colors.brandLight,
    fontFamily: 'Poppins_500Medium',
  },
});
