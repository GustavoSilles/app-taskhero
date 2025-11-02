import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';
import { IconSymbol } from '../ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

interface EditProfileFormData {
  name: string;
  email: string;
  avatarUrl?: string;
}

interface EditProfileFormProps {
  initialData: EditProfileFormData;
  onSubmit: (data: EditProfileFormData) => void;
  onCancel: () => void;
}

export function EditProfileForm({ initialData, onSubmit, onCancel }: EditProfileFormProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);

  const handleSubmit = () => {
    if (!name.trim()) {
      alert('Nome é obrigatório');
      return;
    }

    if (!email.trim()) {
      alert('E-mail é obrigatório');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('E-mail inválido');
      return;
    }

    onSubmit({
      name: name.trim(),
      email: email.trim(),
      avatarUrl: initialData.avatarUrl,
    });
  };

  const handleChangePhoto = () => {
    // TODO: Implementar seleção de foto da galeria ou câmera
    console.log('Alterar foto de perfil');
    alert('Funcionalidade de alteração de foto será implementada em breve!');
  };

  return (
    <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.content}>
          <ThemedText type="subtitle" style={styles.formTitle}>
            Editar Perfil
          </ThemedText>

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              {initialData.avatarUrl ? (
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
            </View>
            
            <TouchableOpacity
              style={[styles.changePhotoButton, { backgroundColor: colors.primary }]}
              onPress={handleChangePhoto}>
              <IconSymbol name="pencil" size={18} color="#fff" />
              <ThemedText style={styles.changePhotoText}>
                Alterar Foto
              </ThemedText>
            </TouchableOpacity>
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    flex: 1,
  },
  formTitle: {
    marginBottom: 24,
    textAlign: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  changePhotoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
