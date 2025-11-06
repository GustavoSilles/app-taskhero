import { ScrollView, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useRef, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GoalStatusBadge } from '@/components/goal-status-badge';
import { TaskItem } from '@/components/task-item';
import { CreateTaskBottomSheet } from '@/components/bottom-sheets/create-task-bottom-sheet';
import { EditGoalBottomSheet } from '@/components/bottom-sheets/edit-goal-bottom-sheet';
import { EmptyState } from '@/components/empty-state';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { mockGoals } from '@/mocks/goals';
import { getTasksByGoalId } from '@/mocks/tasks';
import { canDeleteGoal, formatDeadlineMessage, calculateGoalPoints } from '@/utils/goal-status';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import { ConfirmationModal } from '@/components/confirmation-modal';

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [tasks, setTasks] = useState(getTasksByGoalId(id || ''));
  const [showDeleteGoalModal, setShowDeleteGoalModal] = useState(false);
  const [showCompleteGoalModal, setShowCompleteGoalModal] = useState(false);
  
  // Refs para os Bottom Sheets
  const taskBottomSheetRef = useRef<BottomSheet>(null);
  const editGoalBottomSheetRef = useRef<BottomSheet>(null);

  // Buscar meta (depois vem do backend)
  const goal = mockGoals.find((g) => g.id === id);

  // Funções para abrir/fechar Bottom Sheet de Tarefa
  const handleOpenTaskBottomSheet = useCallback(() => {
    taskBottomSheetRef.current?.snapToIndex(1);
  }, []);

  const handleCloseTaskBottomSheet = useCallback(() => {
    taskBottomSheetRef.current?.close();
  }, []);

  // Funções para abrir/fechar Bottom Sheet de Editar Meta
  const handleOpenEditGoalBottomSheet = useCallback(() => {
    editGoalBottomSheetRef.current?.snapToIndex(1);
  }, []);

  const handleCloseEditGoalBottomSheet = useCallback(() => {
    editGoalBottomSheetRef.current?.close();
  }, []);

  const handleAddTask = useCallback((taskData: any) => {
    console.log('Nova tarefa:', taskData);
    handleCloseTaskBottomSheet();
    Alert.alert('Sucesso', 'Tarefa criada com sucesso! (+10 pontos)');
  }, [handleCloseTaskBottomSheet]);

  const handleEditGoal = useCallback((goalData: any) => {
    console.log('Meta editada:', goalData);
    handleCloseEditGoalBottomSheet();
    Alert.alert('Sucesso', 'Meta atualizada com sucesso!');
    // Aqui você faria a chamada para a API para atualizar a meta
  }, [handleCloseEditGoalBottomSheet]);

  if (!goal) {
    return (
      <ThemedView style={styles.container}>
        <EmptyState
          icon="exclamationmark.triangle"
          title="Meta não encontrada"
          description="Esta meta não existe ou foi removida"
          actionLabel="Voltar"
          onActionPress={() => router.back()}
        />
      </ThemedView>
    );
  }

  const handleDeleteGoal = () => {
    if (canDeleteGoal(goal.status)) {
      setShowDeleteGoalModal(true);
    } else {
      Alert.alert(
        'Não é possível excluir',
        'Metas concluídas não podem ser excluídas.'
      );
    }
  };

  const confirmDeleteGoal = () => {
    setShowDeleteGoalModal(false);
    console.log('Excluir meta:', goal.id);
    router.back();
  };

  const handleCompleteGoal = () => {
    setShowCompleteGoalModal(true);
  };

  const confirmCompleteGoal = () => {
    setShowCompleteGoalModal(false);
    console.log('Concluir meta:', goal.id);
    const points = calculateGoalPoints('completed');
    Alert.alert('Parabéns!', `Meta concluída! Você ganhou ${points} pontos! 🎉`);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    Alert.alert('Sucesso', 'Tarefa excluída com sucesso!');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
          {/* Cabeçalho da Meta */}
          <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity  
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
          </TouchableOpacity>
          <GoalStatusBadge status={goal.status} size="medium" />
        </View>

        <ThemedText type="title" style={styles.title}>
          {goal.title}
        </ThemedText>

        <ThemedText style={styles.description}>{goal.description}</ThemedText>

        <View style={styles.dateRow}>
          <View style={styles.dateItem}>
            <IconSymbol name="calendar" size={16} color={colors.icon} />
            <ThemedText style={styles.dateText}>
              Início: {goal.startDate.toLocaleDateString('pt-BR')}
            </ThemedText>
          </View>
          <View style={styles.dateItem}>
            <IconSymbol name="flag" size={16} color={colors.icon} />
            <ThemedText style={styles.dateText}>
              Fim: {goal.endDate.toLocaleDateString('pt-BR')}
            </ThemedText>
          </View>
        </View>

        {goal.status === 'in_progress' && (
          <View style={[styles.deadlineBar, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
            <IconSymbol name="clock" size={16} color={colors.warning} />
            <ThemedText style={[styles.deadlineText, { color: colors.warning }]}>
              {formatDeadlineMessage(goal.endDate)}
            </ThemedText>
          </View>
        )}

        {/* Progresso */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <ThemedText>Progresso</ThemedText>
            <ThemedText type="defaultSemiBold">
              {goal.completedTasks}/{goal.totalTasks} tarefas
            </ThemedText>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${goal.progress}%`,
                  backgroundColor: colors.secondary,
                },
              ]}
            />
          </View>
          <ThemedText style={styles.progressPercent}>{goal.progress}%</ThemedText>
        </View>
      </View>

      {/* Lista de Tarefas */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Tarefas ({tasks.length})</ThemedText>
          <TouchableOpacity onPress={handleOpenTaskBottomSheet}>
            <ThemedText style={[styles.addButton, { color: colors.primary }]}>
              + Adicionar
            </ThemedText>
          </TouchableOpacity>
        </View>

        {tasks.length === 0 ? (
          <EmptyState
            icon="checklist"
            title="Nenhuma tarefa"
            description="Adicione tarefas para começar a trabalhar nesta meta"
            actionLabel="Adicionar Tarefa"
            onActionPress={handleOpenTaskBottomSheet}
          />
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              {...task}
              title={task.title}
              onToggle={() => handleToggleTask(task.id)}
              onDelete={() => handleDeleteTask(task.id)}
            />
          ))
        )}
      </View>

      {/* Ações da Meta */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={handleOpenEditGoalBottomSheet}>
          <IconSymbol name="pencil" size={20} color="#fff" />
          <ThemedText style={styles.actionButtonText}>Editar Meta</ThemedText>
        </TouchableOpacity>

        {goal.status === 'in_progress' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.success }]}
            onPress={handleCompleteGoal}>
            <IconSymbol name="checkmark" size={20} color="#fff" />
            <ThemedText style={styles.actionButtonText}>
              Marcar como Concluída
            </ThemedText>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.deleteButton,
            { borderColor: canDeleteGoal(goal.status) ? colors.error : colors.disabled },
            !canDeleteGoal(goal.status) && styles.disabledButton,
          ]}
          onPress={handleDeleteGoal}
          disabled={!canDeleteGoal(goal.status)}>
          <IconSymbol
            name="trash"
            size={20}
            color={canDeleteGoal(goal.status) ? colors.error : colors.disabled}
          />
          <ThemedText
            style={[
              styles.actionButtonText,
              {
                color: canDeleteGoal(goal.status)
                  ? colors.error
                  : colors.disabled,
              },
            ]}>
            {canDeleteGoal(goal.status) ? 'Excluir Meta' : 'Não pode ser excluída'}
          </ThemedText>
        </TouchableOpacity>
      </View>
      </ScrollView>

        {/* Bottom Sheet para criar tarefa */}
        <CreateTaskBottomSheet
          ref={taskBottomSheetRef}
          onSubmit={handleAddTask}
          onClose={handleCloseTaskBottomSheet}
        />

        {/* Bottom Sheet para editar meta */}
        <EditGoalBottomSheet
          ref={editGoalBottomSheetRef}
          goalData={{
            title: goal.title,
            description: goal.description,
            startDate: goal.startDate,
            endDate: goal.endDate,
          }}
          onSubmit={handleEditGoal}
          onClose={handleCloseEditGoalBottomSheet}
        />

        {/* Modal de Confirmação para Excluir Meta */}
        <ConfirmationModal
          visible={showDeleteGoalModal}
          title="Excluir Meta"
          message="Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          cancelText="Cancelar"
          confirmColor={colors.error}
          icon="trash"
          iconColor={colors.error}
          onConfirm={confirmDeleteGoal}
          onCancel={() => setShowDeleteGoalModal(false)}
        />

        {/* Modal de Confirmação para Concluir Meta */}
        <ConfirmationModal
          visible={showCompleteGoalModal}
          title="Concluir Meta"
          message="Deseja marcar esta meta como concluída?"
          confirmText="Concluir"
          cancelText="Cancelar"
          confirmColor={colors.success}
          icon="checkmark.circle.fill"
          iconColor={colors.success}
          onConfirm={confirmCompleteGoal}
          onCancel={() => setShowCompleteGoalModal(false)}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  backButton: {
    padding: 4,
    marginRight: 4,
  },
  title: {
    marginBottom: 12,
  },
  description: {
    opacity: 0.7,
    marginBottom: 16,
    lineHeight: 22,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    opacity: 0.7,
  },
  deadlineBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  deadlineText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressSection: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
  },
  progressPercent: {
    fontSize: 12,
    textAlign: 'right',
    opacity: 0.7,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

