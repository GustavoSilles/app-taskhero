import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { IconSymbol } from './ui/icon-symbol';
import { GoalStatusBadge } from './goal-status-badge';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { GoalStatus } from '@/types';
import { getDaysRemaining, formatDeadlineMessage } from '@/utils/goal-status';

interface GoalCardProps {
  id: string;
  title: string;
  description: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  endDate: Date;
  status: GoalStatus;
  onPress?: () => void;
}

export function GoalCard({
  title,
  description,
  progress,
  totalTasks,
  completedTasks,
  endDate,
  status,
  onPress,
}: GoalCardProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];

  const remainingDays = getDaysRemaining(endDate);
  const deadlineMessage = formatDeadlineMessage(endDate);
  
  const getProgressColor = () => {
    if (progress < 33) return colors.error;
    if (progress < 66) return colors.warning;
    return colors.success;
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <ThemedText type="subtitle" style={styles.title}>
              {title}
            </ThemedText>
          </View>
          <IconSymbol
            name="chevron.right"
            size={20}
            color={colors.icon}
          />
        </View>

        <ThemedText style={styles.description} numberOfLines={2}>
          {description}
        </ThemedText>

        <View style={styles.statusRow}>
          <GoalStatusBadge status={status} size="small" />
        </View>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: getProgressColor(),
                },
              ]}
            />
          </View>
          <ThemedText style={styles.progressText}>
            {completedTasks}/{totalTasks} tarefas • {Math.floor(progress)}%
          </ThemedText>
        </View>

        {status === 'in_progress' && (
          <View style={styles.deadlineContainer}>
            <IconSymbol
              name="clock"
              size={14}
              color={remainingDays < 3 ? colors.error : colors.secondary}
            />
            <ThemedText
              style={[
                styles.deadlineText,
                remainingDays < 3 && { color: colors.error },
              ]}>
              {deadlineMessage}
            </ThemedText>
          </View>
        )}
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    marginBottom: 4,
  },
  description: {
    marginBottom: 12,
    opacity: 0.7,
  },
  statusRow: {
    marginVertical: 8,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    opacity: 0.7,
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deadlineText: {
    fontSize: 12,
    opacity: 0.7,
  },
  urgentDeadline: {
    fontWeight: '600',
  },
});
