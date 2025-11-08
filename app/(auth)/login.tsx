import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemeSelector } from '@/components/theme-selector';
import { Logo } from '@/components/logo';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/contexts/theme-context';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/auth-context';

export default function LoginScreen() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { signIn, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'O email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Digite um email válido';
    }

    if (!password.trim()) {
      newErrors.password = 'A senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    // Limpa erros anteriores
    setErrors({});

    // Valida o formulário
    if (!validateForm()) {
      return;
    }

    try {
      console.log('Tentando fazer login...');
      await signIn(email.trim(), password);
      console.log('Login bem-sucedido! Redirecionando...');
      // Redireciona para a home após login bem-sucedido
      router.replace('/(tabs)');
    } catch (error: any) {
      const errorMessage = error?.message || 'Falha no login. Verifique suas credenciais.';
      setErrors({ general: errorMessage });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled">
          <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Botão de Tema no canto superior direito */}
            <View style={styles.themeButton}>
              <ThemeSelector />
            </View>

          <View style={styles.header}>
            <Logo variant="full" size="large" />
            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
              Transforme suas metas em conquistas
            </ThemedText>
          </View>

          <View style={styles.form}>
            {/* Mensagem de erro geral */}
            {errors.general && (
              <View style={[styles.errorContainer, { backgroundColor: colors.error + '15', borderColor: colors.error }]}>
                <IconSymbol name="exclamationmark.circle.fill" size={20} color={colors.error} />
                <ThemedText style={[styles.errorText, { color: colors.error }]}>
                  {errors.general}
                </ThemedText>
              </View>
            )}

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: errors.email ? colors.error : colors.border,
                  },
                ]}
                placeholder="seu@email.com"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors({ ...errors, email: undefined });
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!isLoading}
              />
              {errors.email && (
                <View style={styles.fieldErrorContainer}>
                  <IconSymbol name="exclamationmark.circle" size={14} color={colors.error} />
                  <ThemedText style={[styles.fieldErrorText, { color: colors.error }]}>
                    {errors.email}
                  </ThemedText>
                </View>
              )}
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Senha</ThemedText>
              <View style={[styles.passwordInputContainer, { borderColor: errors.password ? colors.error : colors.border }]}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      backgroundColor: colors.surface,
                      color: colors.text,
                      borderColor: errors.password ? colors.error : colors.border,
                    },
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) {
                      setErrors({ ...errors, password: undefined });
                    }
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                  disabled={isLoading}>
                  <IconSymbol
                    name={showPassword ? 'eye' : 'eye.slash'}
                    size={22}
                    color={colors.icon}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <View style={styles.fieldErrorContainer}>
                  <IconSymbol name="exclamationmark.circle" size={14} color={colors.error} />
                  <ThemedText style={[styles.fieldErrorText, { color: colors.error }]}>
                    {errors.password}
                  </ThemedText>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleLogin}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <ThemedText style={styles.buttonText}>Entrar</ThemedText>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <ThemedText style={[styles.footerText, { color: colors.textSecondary }]}>
                Ainda não tem uma conta?{' '}
              </ThemedText>
              <TouchableOpacity onPress={() => router.replace('/(auth)/signup')} disabled={isLoading}>
                <ThemedText style={[styles.link, { color: colors.primary }]}>
                  Cadastre-se
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ThemedView>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  themeButton: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
    gap: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  passwordInputContainer: {
    position: 'relative',
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: 'absolute',
    right: 8,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  fieldErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  fieldErrorText: {
    fontSize: 13,
  },
  button: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 15,
  },
  link: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
