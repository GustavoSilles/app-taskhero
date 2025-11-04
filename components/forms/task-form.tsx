import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { TaskPriority } from '@/types';

interface TaskFormData {
  title: string;
  priority: TaskPriority;
}

interface TaskFormProps {
  initialData?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

export function TaskForm({ initialData, onSubmit, onCancel }: TaskFormProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [title, setTitle] = useState(initialData?.title || '');
  const [priority, setPriority] = useState<TaskPriority>(initialData?.priority || 'medium');

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('Título é obrigatório');
      return;
    }

    onSubmit({
      title: title.trim(),
      priority,
    });
  };

  const priorities: { value: TaskPriority; label: string; color: string }[] = [
    { value: 'low', label: 'Baixa', color: colors.success },
    { value: 'medium', label: 'Média', color: colors.warning },
    { value: 'high', label: 'Alta', color: colors.error },
  ];

  return (
    <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.container}>
        <ThemedView style={styles.content}>
          <ThemedText type="subtitle" style={styles.formTitle}>
            {initialData ? 'Editar Tarefa' : 'Nova Tarefa'}
          </ThemedText>

        {/* Título */}
        <View style={styles.field}>
          <ThemedText style={styles.label}>Título *</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Revisar documentação"
            placeholderTextColor={colors.icon}
          />
        </View>

        {/* Prioridade */}
        <View style={styles.field}>
          <ThemedText style={styles.label}>Prioridade</ThemedText>
          <View style={styles.priorityRow}>
            {priorities.map((p) => (
              <TouchableOpacity
                key={p.value}
                onPress={() => setPriority(p.value)}
                style={[
                  styles.priorityButton,
                  priority === p.value && {
                    backgroundColor: p.color,
                    borderColor: p.color,
                  },
                  priority !== p.value && {
                    borderColor: colors.border,
                  },
                ]}>
                <ThemedText
                  style={[
                    styles.priorityText,
                    priority === p.value && styles.priorityTextActive,
                  ]}>
                  {p.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
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
              {initialData ? 'Salvar' : 'Criar Tarefa'}
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
  content: {
    padding: 20,
  },
  formTitle: {
    marginBottom: 24,
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  priorityTextActive: {
    color: '#fff',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  dateText: {
    fontSize: 16,
  },
  clearDate: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
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
