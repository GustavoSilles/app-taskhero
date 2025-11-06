import { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';
import { IconSymbol } from '../ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

interface GoalFormData {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

interface GoalFormProps {
  initialData?: Partial<GoalFormData>;
  onSubmit: (data: GoalFormData) => void;
  onCancel: () => void;
}

export function GoalForm({ initialData, onSubmit, onCancel }: GoalFormProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [startDate, setStartDate] = useState(initialData?.startDate || new Date());
  const [endDate, setEndDate] = useState(
    initialData?.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    endDate?: string;
    general?: string;
  }>({});

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const validateForm = () => {
    const newErrors: {
      title?: string;
      description?: string;
      endDate?: string;
    } = {};

    if (!title.trim()) {
      newErrors.title = 'O título é obrigatório';
    } else if (title.trim().length < 3) {
      newErrors.title = 'O título deve ter pelo menos 3 caracteres';
    }

    if (!description.trim()) {
      newErrors.description = 'A descrição é obrigatória';
    } else if (description.trim().length < 10) {
      newErrors.description = 'A descrição deve ter pelo menos 10 caracteres';
    }

    if (endDate <= startDate) {
      newErrors.endDate = 'A data final deve ser maior que a data inicial';
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

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      startDate,
      endDate,
    });
  };

  return (
    <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.content}>
          <ThemedText type="subtitle" style={styles.formTitle}>
            {initialData ? 'Editar Meta' : 'Nova Meta'}
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

        {/* Título */}
        <View style={styles.field}>
          <ThemedText style={styles.label}>Título *</ThemedText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                borderColor: errors.title ? colors.error : colors.border,
                color: colors.text,
              },
            ]}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (errors.title) {
                setErrors({ ...errors, title: undefined });
              }
            }}
            placeholder="Ex: Aprender React Native"
            placeholderTextColor={colors.icon}
          />
          {errors.title && (
            <View style={styles.fieldErrorContainer}>
              <IconSymbol name="exclamationmark.circle" size={14} color={colors.error} />
              <ThemedText style={[styles.fieldErrorText, { color: colors.error }]}>
                {errors.title}
              </ThemedText>
            </View>
          )}
        </View>

        {/* Descrição */}
        <View style={styles.field}>
          <ThemedText style={styles.label}>Descrição *</ThemedText>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: colors.background,
                borderColor: errors.description ? colors.error : colors.border,
                color: colors.text,
              },
            ]}
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              if (errors.description) {
                setErrors({ ...errors, description: undefined });
              }
            }}
            placeholder="Descreva sua meta em detalhes..."
            placeholderTextColor={colors.icon}
            multiline
            numberOfLines={4}
          />
          {errors.description && (
            <View style={styles.fieldErrorContainer}>
              <IconSymbol name="exclamationmark.circle" size={14} color={colors.error} />
              <ThemedText style={[styles.fieldErrorText, { color: colors.error }]}>
                {errors.description}
              </ThemedText>
            </View>
          )}
        </View>

        {/* Datas */}
        <View style={styles.field}>
          <ThemedText style={styles.label}>Data Inicial *</ThemedText>
          <TouchableOpacity
            style={[styles.dateButton, { borderColor: colors.border }]}
            onPress={() => setShowStartDatePicker(true)}>
            <IconSymbol name="calendar" size={20} color={colors.icon} />
            <ThemedText style={styles.dateText}>
              {startDate.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </ThemedText>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleStartDateChange}
              locale="pt-BR"
            />
          )}
        </View>

        <View style={styles.field}>
          <ThemedText style={styles.label}>Data Final *</ThemedText>
          <TouchableOpacity
            style={[styles.dateButton, { borderColor: errors.endDate ? colors.error : colors.border }]}
            onPress={() => setShowEndDatePicker(true)}>
            <IconSymbol name="flag" size={20} color={colors.icon} />
            <ThemedText style={styles.dateText}>
              {endDate.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </ThemedText>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleEndDateChange}
              locale="pt-BR"
              minimumDate={startDate}
            />
          )}
          {errors.endDate && (
            <View style={styles.fieldErrorContainer}>
              <IconSymbol name="exclamationmark.circle" size={14} color={colors.error} />
              <ThemedText style={[styles.fieldErrorText, { color: colors.error }]}>
                {errors.endDate}
              </ThemedText>
            </View>
          )}
          <ThemedText style={styles.hint}>
            Prazo: {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))}{' '}
            dias
          </ThemedText>
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
              {initialData ? 'Salvar' : 'Criar Meta'}
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
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
    flex: 1,
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
