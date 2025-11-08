import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { ConfirmationModal } from './confirmation-modal';

interface TaskItemProps {
  id: string;
  title: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  onToggle?: () => void;
  onDelete?: () => void;
}

export function TaskItem({
  title,
  completed,
  priority = 'medium',
  onToggle,
  onDelete,
}: TaskItemProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getPriorityColor = () => {
    switch (priority) {
      case 'high':
        return colors.error;
      case 'medium':
        return colors.warning;
      case 'low':
        return colors.success;
      default:
        return colors.icon;
    }
  };

  const handleLongPress = () => {
    // Só abre o modal se onDelete estiver definido (meta não concluída)
    if (onDelete) {
      setShowDeleteModal(true);
    }
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <>
      <TouchableOpacity 
        onPress={onToggle}
        onLongPress={onDelete ? handleLongPress : undefined}
        activeOpacity={0.7}
        delayLongPress={500}
      >
        <ThemedView style={styles.container}>
          <View
            style={[
              styles.checkbox,
              completed && { backgroundColor: colors.success },
              { borderColor: completed ? colors.success : colors.border },
            ]}>
            {completed && (
              <IconSymbol name="checkmark" size={16} color="#fff" />
            )}
          </View>

          <View style={styles.content}>
            <ThemedText
              style={[
                styles.title,
                completed && styles.completedTitle,
              ]}>
              {title}
            </ThemedText>
          </View>

          <View
            style={[
              styles.priorityIndicator,
              { backgroundColor: getPriorityColor() },
            ]}
          />
        </ThemedView>
      </TouchableOpacity>

      {/* Modal de Confirmação para Excluir Tarefa */}
      <ConfirmationModal
        visible={showDeleteModal}
        title="Excluir Tarefa"
        message={`Deseja realmente excluir a tarefa "${title}"?`}
        confirmText="Excluir"
        cancelText="Cancelar"
        confirmColor={colors.error}
        icon="trash"
        iconColor={colors.error}
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
