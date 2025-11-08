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

export default function SignUpScreen() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];
  const { signUp, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'O nome é obrigatório';
    } else if (name.trim().length < 3) {
      newErrors.name = 'O nome deve ter pelo menos 3 caracteres';
    }

    if (!email.trim()) {
      newErrors.email = 'O email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Digite um email válido';
    }

    if (!password.trim()) {
      newErrors.password = 'A senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirme sua senha';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    // Limpa erros anteriores
    setErrors({});

    // Valida o formulário
    if (!validateForm()) {
      return;
    }

    try {
      await signUp(name.trim(), email.trim(), password);
      // Redireciona para a home após cadastro bem-sucedido
      router.replace('/(tabs)');
    } catch (error: any) {
      const errorMessage = error?.message || 'Falha no cadastro. Tente novamente.';
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
            <ThemedText style={styles.title}>Criar Conta</ThemedText>
            <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
              Comece sua jornada de conquistas
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
              <ThemedText style={styles.label}>Nome</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    color: colors.text,
                    borderColor: errors.name ? colors.error : colors.border,
                  },
                ]}
                placeholder="Seu nome completo"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) {
                    setErrors({ ...errors, name: undefined });
                  }
                }}
                autoComplete="name"
                editable={!isLoading}
              />
              {errors.name && (
                <View style={styles.fieldErrorContainer}>
                  <IconSymbol name="exclamationmark.circle" size={14} color={colors.error} />
                  <ThemedText style={[styles.fieldErrorText, { color: colors.error }]}>
                    {errors.name}
                  </ThemedText>
                </View>
              )}
            </View>

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
                  placeholder="Mínimo 6 caracteres"
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
                  autoComplete="password-new"
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

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Confirmar Senha</ThemedText>
              <View style={[styles.passwordInputContainer, { borderColor: errors.confirmPassword ? colors.error : colors.border }]}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      backgroundColor: colors.surface,
                      color: colors.text,
                      borderColor: errors.confirmPassword ? colors.error : colors.border,
                    },
                  ]}
                  placeholder="Digite a senha novamente"
                  placeholderTextColor={colors.textSecondary}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: undefined });
                    }
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  activeOpacity={0.7}
                  disabled={isLoading}>
                  <IconSymbol
                    name={showConfirmPassword ? 'eye' : 'eye.slash'}
                    size={22}
                    color={colors.icon}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <View style={styles.fieldErrorContainer}>
                  <IconSymbol name="exclamationmark.circle" size={14} color={colors.error} />
                  <ThemedText style={[styles.fieldErrorText, { color: colors.error }]}>
                    {errors.confirmPassword}
                  </ThemedText>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleSignUp}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <ThemedText style={styles.buttonText}>Cadastrar</ThemedText>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <ThemedText style={[styles.footerText, { color: colors.textSecondary }]}>
                Já tem uma conta?{' '}
              </ThemedText>
              <TouchableOpacity onPress={() => router.replace('/(auth)/login')} disabled={isLoading}>
                <ThemedText style={[styles.link, { color: colors.primary }]}>
                  Fazer login
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
    marginBottom: 40,
    gap: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
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
    marginBottom: 16,
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
