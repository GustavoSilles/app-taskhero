import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';

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
    Alert.alert(
      'Excluir Tarefa',
      `Deseja realmente excluir a tarefa "${title}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            if (onDelete) {
              onDelete();
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity 
      onPress={onToggle}
      onLongPress={handleLongPress}
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
