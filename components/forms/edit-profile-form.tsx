import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
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
}

export function EditProfileForm({ initialData, onSubmit, onCancel, onAvatarEdit }: EditProfileFormProps) {
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

  // Obtém a imagem do avatar de herói selecionado
  const heroAvatarImage = initialData.selectedAvatarId ? getAvatarImage(initialData.selectedAvatarId) : null;
  const selectedAvatar = initialData.selectedAvatarId ? getAvatarById(initialData.selectedAvatarId) : null;

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Erro', 'E-mail é obrigatório');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Erro', 'E-mail inválido');
      return;
    }

    // Validação de senha (se estiver alterando)
    const isChangingPassword = currentPassword || newPassword || confirmPassword;
    
    if (isChangingPassword) {
      if (!currentPassword) {
        Alert.alert('Erro', 'Digite sua senha atual para alterá-la');
        return;
      }

      if (!newPassword) {
        Alert.alert('Erro', 'Digite a nova senha');
        return;
      }

      if (newPassword.length < 6) {
        Alert.alert('Erro', 'A nova senha deve ter no mínimo 6 caracteres');
        return;
      }

      if (newPassword !== confirmPassword) {
        Alert.alert('Erro', 'A confirmação da senha não confere');
        return;
      }

      if (currentPassword === newPassword) {
        Alert.alert('Erro', 'A nova senha deve ser diferente da senha atual');
        return;
      }
    }

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
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Seu nome completo"
              placeholderTextColor={colors.icon}
              autoCapitalize="words"
            />
          </View>

          {/* E-mail */}
          <View style={styles.field}>
            <ThemedText style={styles.label}>E-mail *</ThemedText>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="seu.email@exemplo.com"
              placeholderTextColor={colors.icon}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
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
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
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
            </View>

            {/* Nova Senha */}
            <View style={styles.field}>
              <ThemedText style={styles.label}>Nova Senha</ThemedText>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={newPassword}
                  onChangeText={setNewPassword}
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
              <ThemedText style={styles.hint}>Mínimo de 6 caracteres</ThemedText>
            </View>

            {/* Confirmar Nova Senha */}
            <View style={styles.field}>
              <ThemedText style={styles.label}>Confirmar Nova Senha</ThemedText>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
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
            </View>
          </View>

          {/* Botões */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
              onPress={onCancel}>
              <ThemedText style={styles.cancelButtonText}>Cancelar</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submitButton, { backgroundColor: colors.primary }]}
              onPress={handleSubmit}>
              <ThemedText style={styles.submitButtonText}>
                Salvar Alterações
              </ThemedText>
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
