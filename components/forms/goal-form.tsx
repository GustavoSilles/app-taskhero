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

  const handleSubmit = () => {
    if (!title.trim()) {
      alert('Título é obrigatório');
      return;
    }

    if (!description.trim()) {
      alert('Descrição é obrigatória');
      return;
    }

    if (endDate <= startDate) {
      alert('Data final deve ser maior que data inicial');
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
            placeholder="Ex: Aprender React Native"
            placeholderTextColor={colors.icon}
          />
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
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Descreva sua meta em detalhes..."
            placeholderTextColor={colors.icon}
            multiline
            numberOfLines={4}
          />
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
            style={[styles.dateButton, { borderColor: colors.border }]}
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
