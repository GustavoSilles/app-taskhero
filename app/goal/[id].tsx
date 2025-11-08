import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useRef, useCallback, useEffect } from 'react';
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
import { useGoals } from '@/contexts/goals-context';
import { useTasks } from '@/contexts/tasks-context';
import { canDeleteGoal, formatDeadlineMessage, calculateGoalPoints, canEditGoal, canAddTasks } from '@/utils/goal-status';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import { ConfirmationModal } from '@/components/confirmation-modal';
import { useToast } from '@/contexts/toast-context';

export default function GoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];
  const toast = useToast();
  const {deleteGoal, updateGoal, concludeGoal, getGoalById } = useGoals();
  const { tasks, fetchTasks, createTask, updateTask, deleteTask: deleteTaskFromContext, concludeTask } = useTasks();

  const [showDeleteGoalModal, setShowDeleteGoalModal] = useState(false);
  const [showCompleteGoalModal, setShowCompleteGoalModal] = useState(false);
  const [goal, setGoal] = useState<any>(null);
  
  // Refs para os Bottom Sheets
  const taskBottomSheetRef = useRef<BottomSheet>(null);
  const editGoalBottomSheetRef = useRef<BottomSheet>(null);

  // Buscar meta do contexto ou do backend
  useEffect(() => {
    const loadGoal = async () => {
      if (!id) return;
      
      try {
        const goalData = await getGoalById(id);
        setGoal(goalData);
      } catch (error) {
        console.error('Erro ao carregar meta:', error);
        setGoal(null);
      }
    };

    loadGoal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Removido getGoalById das dependências para evitar loops

  // Carrega as tarefas quando a meta é carregada
  useEffect(() => {
    if (goal?.id) {
      fetchTasks(goal.id);
    }
  }, [goal?.id, fetchTasks]);

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

  const handleAddTask = useCallback(async (taskData: any) => {
    if (!goal) return;
    
    try {
      // Mapeia prioridade do frontend para backend
      let prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' = 'MEDIA';
      switch (taskData.priority) {
        case 'low':
          prioridade = 'BAIXA';
          break;
        case 'high':
          prioridade = 'ALTA';
          break;
        default:
          prioridade = 'MEDIA';
      }

      await createTask(goal.id, {
        titulo: taskData.title,
        prioridade,
      });
      
      // Recarrega a meta específica para atualizar o progresso (forçando refresh do backend)
      const updatedGoal = await getGoalById(goal.id, true);
      setGoal(updatedGoal);

      handleCloseTaskBottomSheet();
      setTimeout(() => {
        toast.success('Sucesso', 'Tarefa criada com sucesso! (+10 pontos)');
      }, 300);
    } catch (error: any) {
      console.error('Erro ao criar tarefa:', error);
      toast.error('Erro', error.message || 'Não foi possível criar a tarefa');
    }
  }, [goal, createTask, getGoalById, handleCloseTaskBottomSheet, toast]);

  const handleEditGoal = useCallback(async (goalData: any) => {
    if (!goal) return;
    
    try {
      // Formata os dados para o backend
      const updateData: any = {
        titulo: goalData.title,
        descricao: goalData.description,
      };

      // Só inclui as datas se foram alteradas
      if (goalData.startDate) {
        updateData.data_inicio = goalData.startDate.toISOString();
      }
      if (goalData.endDate) {
        updateData.data_fim = goalData.endDate.toISOString();
      }

      const updatedGoal = await updateGoal(goal.id, updateData);
      setGoal(updatedGoal); // Atualiza o estado local
      
      handleCloseEditGoalBottomSheet();
      setTimeout(() => {
        toast.success('Sucesso', 'Meta atualizada com sucesso!');
      }, 300);
    } catch (error: any) {
      console.error('Erro ao editar meta:', error);
      toast.error('Erro', error.message || 'Não foi possível atualizar a meta');
    }
  }, [goal, updateGoal, handleCloseEditGoalBottomSheet, toast]);

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
      toast.warning('Não é possível excluir', 'Metas concluídas não podem ser excluídas.');
    }
  };

  const confirmDeleteGoal = async () => {
    setShowDeleteGoalModal(false);
    
    // Navega imediatamente para evitar tentar carregar a meta deletada
    router.back();
    
    try {
      await deleteGoal(goal.id);
      toast.success('Sucesso', 'Meta excluída com sucesso!');
    } catch (error: any) {
      console.error('Erro ao excluir meta:', error);
      toast.error('Erro', error.message || 'Não foi possível excluir a meta');
    }
  };

  const handleCompleteGoal = () => {
    setShowCompleteGoalModal(true);
  };

  const confirmCompleteGoal = async () => {
    setShowCompleteGoalModal(false);
    
    try {
      const updatedGoal = await concludeGoal(goal.id);
      setGoal(updatedGoal); // Atualiza o estado local
      
      // Calcula pontos baseado no status real da meta concluída
      const points = calculateGoalPoints(updatedGoal.status);
      const message = updatedGoal.status === 'completed_late' 
        ? `Meta concluída com atraso! Você ganhou ${points} pontos.`
        : `Meta concluída! Você ganhou ${points} pontos! 🎉`;
      
      toast.success('Parabéns!', message);
    } catch (error: any) {
      console.error('Erro ao concluir meta:', error);
      toast.error('Erro', error.message || 'Não foi possível concluir a meta');
    }
  };

  const handleToggleTask = async (taskId: string) => {
    if (!goal) return;
    
    try {
      // Encontra a tarefa para verificar o status atual
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      // Se já está concluída, volta para pendente
      // Se está pendente, marca como concluída
      if (task.completed) {
        // Mapeia prioridade para o formato do backend
        let prioridade: 'BAIXA' | 'MEDIA' | 'ALTA' = 'MEDIA';
        switch (task.priority) {
          case 'low':
            prioridade = 'BAIXA';
            break;
          case 'high':
            prioridade = 'ALTA';
            break;
          default:
            prioridade = 'MEDIA';
        }
        
        await updateTask(goal.id, taskId, { 
          titulo: task.title, 
          prioridade,
          status: 'PENDENTE'
        });
      } else {
        await concludeTask(goal.id, taskId);
      }
      
      // Recarrega a meta específica para atualizar o progresso (forçando refresh do backend)
      const updatedGoal = await getGoalById(goal.id, true);
      setGoal(updatedGoal);
      
      toast.success('Sucesso', 'Tarefa atualizada!');
    } catch (error: any) {
      console.error('Erro ao alternar tarefa:', error);
      toast.error('Erro', error.message || 'Não foi possível atualizar a tarefa');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!goal) return;
    
    try {
      await deleteTaskFromContext(goal.id, taskId);
      
      // Recarrega a meta específica para atualizar o progresso (forçando refresh do backend)
      const updatedGoal = await getGoalById(goal.id, true);
      setGoal(updatedGoal);
      
      toast.success('Sucesso', 'Tarefa excluída com sucesso!');
    } catch (error: any) {
      console.error('Erro ao excluir tarefa:', error);
      toast.error('Erro', error.message || 'Não foi possível excluir a tarefa');
    }
  };

  const getProgressColor = () => {
    if (goal.progress < 33) return colors.error;
    if (goal.progress < 66) return colors.warning;
    return colors.success;
  };

  const canCompleteGoal = () => {
    if (tasks.length === 0) return false;
    return tasks.every(task => task.completed);
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
                  backgroundColor: getProgressColor(),
                },
              ]}
            />
          </View>
          <ThemedText style={styles.progressPercent}>{Math.floor(goal.progress)}%</ThemedText>
        </View>
      </View>

      {/* Lista de Tarefas */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle">Tarefas ({tasks.length})</ThemedText>
          {canAddTasks(goal.status) && (
            <TouchableOpacity onPress={handleOpenTaskBottomSheet}>
              <ThemedText style={[styles.addButton, { color: colors.primary }]}>
                + Adicionar
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {tasks.length === 0 ? (
          <EmptyState
            icon="checklist"
            title="Nenhuma tarefa"
            description={
              canAddTasks(goal.status)
                ? "Adicione tarefas para começar a trabalhar nesta meta"
                : "Esta meta não possui tarefas"
            }
            actionLabel={canAddTasks(goal.status) ? "Adicionar Tarefa" : undefined}
            onActionPress={canAddTasks(goal.status) ? handleOpenTaskBottomSheet : undefined}
          />
        ) : (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              {...task}
              title={task.title}
              onToggle={canEditGoal(goal.status) ? () => handleToggleTask(task.id) : undefined}
              onDelete={canEditGoal(goal.status) ? () => handleDeleteTask(task.id) : undefined}
            />
          ))
        )}
      </View>

      {/* Ações da Meta */}
      <View style={styles.actions}>
        {canEditGoal(goal.status) && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={handleOpenEditGoalBottomSheet}>
            <IconSymbol name="pencil" size={20} color="#fff" />
            <ThemedText style={styles.actionButtonText}>Editar Meta</ThemedText>
          </TouchableOpacity>
        )}

        {canEditGoal(goal.status) && (
          <TouchableOpacity
            style={[
              styles.actionButton, 
              { 
                backgroundColor: canCompleteGoal() ? colors.success : colors.disabled 
              },
              !canCompleteGoal() && styles.disabledButton
            ]}
            onPress={handleCompleteGoal}
            disabled={!canCompleteGoal()}>
            <IconSymbol name="checkmark" size={20} color="#fff" />
            <ThemedText style={styles.actionButtonText}>
              {canCompleteGoal() 
                ? goal.status === 'expired' 
                  ? 'Marcar como Concluída (com atraso)'
                  : 'Marcar como Concluída'
                : tasks.length === 0 
                  ? 'Adicione tarefas primeiro'
                  : 'Complete todas as tarefas'}
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

