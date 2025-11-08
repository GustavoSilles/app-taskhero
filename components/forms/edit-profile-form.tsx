import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Image, ActivityIndicator, Keyboard } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';
import { IconSymbol } from '../ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { getAvatarImage, getAvatarById } from '@/constants/avatars';

interface EditProfileFormData {
  name: string;
  email: string;
  avatarUrl?: string;
  selectedAvatarId?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface EditProfileFormProps {
  initialData: EditProfileFormData;
  onSubmit: (data: EditProfileFormData) => void;
  onCancel: () => void;
  onAvatarEdit?: () => void;
  isLoading?: boolean;
}

export function EditProfileForm({ initialData, onSubmit, onCancel, onAvatarEdit, isLoading = false }: EditProfileFormProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  // Obtém a imagem do avatar de herói selecionado
  const heroAvatarImage = initialData.selectedAvatarId ? getAvatarImage(initialData.selectedAvatarId) : null;
  const selectedAvatar = initialData.selectedAvatarId ? getAvatarById(initialData.selectedAvatarId) : null;

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'O nome é obrigatório';
    } else if (name.trim().length < 3) {
      newErrors.name = 'O nome deve ter pelo menos 3 caracteres';
    }

    if (!email.trim()) {
      newErrors.email = 'O e-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Digite um e-mail válido';
    }

    // Validação de senha (se estiver alterando)
    const isChangingPassword = currentPassword || newPassword || confirmPassword;
    
    if (isChangingPassword) {
      if (!currentPassword) {
        newErrors.currentPassword = 'Digite sua senha atual';
      }

      if (!newPassword) {
        newErrors.newPassword = 'Digite a nova senha';
      } else if (newPassword.length < 6) {
        newErrors.newPassword = 'A senha deve ter no mínimo 6 caracteres';
      }

      if (!confirmPassword) {
        newErrors.confirmPassword = 'Confirme a nova senha';
      } else if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }

      if (currentPassword && newPassword && currentPassword === newPassword) {
        newErrors.newPassword = 'A nova senha deve ser diferente da atual';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    // Limpa erros anteriores
    setErrors({});

    // Valida o formulário
    if (!validateForm()) {
      return;
    }

    // Fecha o teclado
    Keyboard.dismiss();

    const isChangingPassword = currentPassword || newPassword || confirmPassword;

    onSubmit({
      name: name.trim(),
      email: email.trim(),
      avatarUrl: initialData.avatarUrl,
      ...(isChangingPassword && {
        currentPassword,
        newPassword,
        confirmPassword,
      }),
    });
  };



  return (
    <ThemedView style={styles.content}>
          <ThemedText type="subtitle" style={styles.formTitle}>
            Editar Perfil
          </ThemedText>

          {/* Mensagem de erro geral */}
          {errors.general && (
            <View style={[styles.errorContainer, { backgroundColor: colors.error + '15', borderColor: colors.error }]}>
              <IconSymbol name="exclamationmark.circle.fill" size={20} color={colors.error} />
              <ThemedText style={[styles.errorText, { color: colors.error }]}>
                {errors.general}
              </ThemedText>
            </View>
          )}

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={[styles.avatarContainer, { position: 'relative' }]}>
              {heroAvatarImage ? (
                <Image source={heroAvatarImage} style={styles.avatar} />
              ) : initialData.avatarUrl ? (
                <Image source={{ uri: initialData.avatarUrl }} style={styles.avatar} />
              ) : (
                <View
                  style={[
                    styles.avatarPlaceholder,
                    { backgroundColor: colors.secondary },
                  ]}>
                  <IconSymbol name="person.fill" size={50} color="#fff" />
                </View>
              )}
              <TouchableOpacity
                style={[
                  styles.editAvatarButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={onAvatarEdit}>
                <IconSymbol name="pencil" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            {selectedAvatar && (
              <ThemedText style={styles.avatarName}>{selectedAvatar.name}</ThemedText>
            )}
          </View>

          {/* Nome */}
          <View style={styles.field}>
            <ThemedText style={styles.label}>Nome *</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  borderColor: errors.name ? colors.error : colors.border,
                  color: colors.text,
                },
              ]}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) {
                  setErrors({ ...errors, name: undefined });
                }
              }}
              placeholder="Seu nome completo"
              placeholderTextColor={colors.icon}
              autoCapitalize="words"
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

          {/* E-mail */}
          <View style={styles.field}>
            <ThemedText style={styles.label}>E-mail *</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  borderColor: errors.email ? colors.error : colors.border,
                  color: colors.text,
                },
              ]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  setErrors({ ...errors, email: undefined });
                }
              }}
              placeholder="seu.email@exemplo.com"
              placeholderTextColor={colors.icon}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
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

          {/* Seção de Alteração de Senha */}
          <View style={styles.passwordSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Alterar Senha
            </ThemedText>
            <ThemedText style={[styles.hint, { marginBottom: 16 }]}>
              Deixe em branco se não quiser alterar a senha
            </ThemedText>

            {/* Senha Atual */}
            <View style={styles.field}>
              <ThemedText style={styles.label}>Senha Atual</ThemedText>
              <View style={[styles.passwordInputContainer, { borderColor: errors.currentPassword ? colors.error : colors.border, borderWidth: 1, borderRadius: 8 }]}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      backgroundColor: colors.background,
                      borderColor: 'transparent',
                      color: colors.text,
                    },
                  ]}
                  value={currentPassword}
                  onChangeText={(text) => {
                    setCurrentPassword(text);
                    if (errors.currentPassword) {
                      setErrors({ ...errors, currentPassword: undefined });
                    }
                  }}
                  placeholder="Digite sua senha atual"
                  placeholderTextColor={colors.icon}
                  secureTextEntry={!showCurrentPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  activeOpacity={0.7}>
                  <IconSymbol
                    name={showCurrentPassword ? 'eye' : 'eye.slash'}
                    size={22}
                    color={colors.icon}
                  />
                </TouchableOpacity>
              </View>
              {errors.currentPassword && (
                <View style={styles.fieldErrorContainer}>
                  <IconSymbol name="exclamationmark.circle" size={14} color={colors.error} />
                  <ThemedText style={[styles.fieldErrorText, { color: colors.error }]}>
                    {errors.currentPassword}
                  </ThemedText>
                </View>
              )}
            </View>

            {/* Nova Senha */}
            <View style={styles.field}>
              <ThemedText style={styles.label}>Nova Senha</ThemedText>
              <View style={[styles.passwordInputContainer, { borderColor: errors.newPassword ? colors.error : colors.border, borderWidth: 1, borderRadius: 8 }]}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      backgroundColor: colors.background,
                      borderColor: 'transparent',
                      color: colors.text,
                    },
                  ]}
                  value={newPassword}
                  onChangeText={(text) => {
                    setNewPassword(text);
                    if (errors.newPassword) {
                      setErrors({ ...errors, newPassword: undefined });
                    }
                  }}
                  placeholder="Digite a nova senha"
                  placeholderTextColor={colors.icon}
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  activeOpacity={0.7}>
                  <IconSymbol
                    name={showNewPassword ? 'eye' : 'eye.slash'}
                    size={22}
                    color={colors.icon}
                  />
                </TouchableOpacity>
              </View>
              {errors.newPassword && (
                <View style={styles.fieldErrorContainer}>
                  <IconSymbol name="exclamationmark.circle" size={14} color={colors.error} />
                  <ThemedText style={[styles.fieldErrorText, { color: colors.error }]}>
                    {errors.newPassword}
                  </ThemedText>
                </View>
              )}
              {!errors.newPassword && (
                <ThemedText style={styles.hint}>Mínimo de 6 caracteres</ThemedText>
              )}
            </View>

            {/* Confirmar Nova Senha */}
            <View style={styles.field}>
              <ThemedText style={styles.label}>Confirmar Nova Senha</ThemedText>
              <View style={[styles.passwordInputContainer, { borderColor: errors.confirmPassword ? colors.error : colors.border, borderWidth: 1, borderRadius: 8 }]}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      backgroundColor: colors.background,
                      borderColor: 'transparent',
                      color: colors.text,
                    },
                  ]}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) {
                      setErrors({ ...errors, confirmPassword: undefined });
                    }
                  }}
                  placeholder="Confirme a nova senha"
                  placeholderTextColor={colors.icon}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  activeOpacity={0.7}>
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
          </View>

          {/* Botões */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
              onPress={onCancel}
              disabled={isLoading}>
              <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button, 
                styles.submitButton, 
                { backgroundColor: colors.primary, opacity: isLoading ? 0.7 : 1 }
              ]}
              onPress={handleSubmit}
              disabled={isLoading}>
              {isLoading ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <ActivityIndicator size="small" color="#fff" />
                  <ThemedText style={styles.submitButtonText}>
                    Salvando...
                  </ThemedText>
                </View>
              ) : (
                <ThemedText style={styles.submitButtonText}>
                  Salvar Alterações
                </ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
  },
  formTitle: {
    marginBottom: 24,
    textAlign: 'center',
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginBottom: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
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
  passwordSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 18,
  },
  passwordInputContainer: {
    position: 'relative',
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
  hint: {
    marginTop: 8,
    fontSize: 12,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {},
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
