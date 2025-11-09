// Funções utilitárias para cálculo de status, coins e XP de metas e tarefas
// Baseado nas Regras de Negócio (RN01-RN08)

import { GoalStatus } from '@/types';

/**
 * RN01-RN04: Calcula o status de uma meta baseado nas datas e conclusão
 */
export function calculateGoalStatus(
  endDate: Date,
  completedAt?: Date,
  completedTasks: number = 0,
  totalTasks: number = 0
): GoalStatus {
  const now = new Date();
  
  // Se a meta foi marcada como concluída
  if (completedAt) {
    // RN07: Meta concluída dentro do prazo = 100 coins e 100 XP
    if (completedAt <= endDate) {
      return 'completed';
    }
    // RN08: Meta concluída com atraso = 50 coins e 0 XP
    return 'completed_late';
  }
  
  // Se todas as tarefas foram concluídas mas após o prazo
  if (now > endDate && totalTasks > 0 && completedTasks === totalTasks) {
    return 'completed_late';
  }
  
  // RN03: Meta expirada não conta para progressão de nível
  if (now > endDate) {
    return 'expired';
  }
  
  // Meta ainda está em andamento
  return 'in_progress';
}

/**
 * RN01: Uma meta só pode ser excluída se o status for Em andamento ou Expirado
 */
export function canDeleteGoal(status: GoalStatus): boolean {
  return status === 'in_progress' || status === 'expired';
}

/**
 * Uma meta expirada ainda pode ser editada e concluída
 */
export function canEditGoal(status: GoalStatus): boolean {
  return status === 'in_progress' || status === 'expired';
}

/**
 * Tarefas podem ser adicionadas em metas em andamento ou expiradas
 */
export function canAddTasks(status: GoalStatus): boolean {
  return status === 'in_progress' || status === 'expired';
}

/**
 * RN07-RN08: Calcula coins ganhos ao completar uma meta
 */
export function calculateGoalPoints(status: GoalStatus): number {
  switch (status) {
    case 'completed':
      return 100; // RN07: Meta no prazo = 100 coins e 100 XP
    case 'completed_late':
      return 50; // RN08: Meta com atraso = 50 coins e 0 XP
    default:
      return 0;
  }
}

/**
 * RN06: Cada tarefa concluída vale 10 coins e 10 XP
 * Desmarcar uma tarefa remove 10 coins e 10 XP
 */
export const TASK_POINTS = 10;
export const TASK_XP = 10;

/**
 * RN02-RN04: Verifica se uma meta conta para progressão de nível
 * Apenas metas concluídas dentro do prazo contam
 */
export function countsForLevel(status: GoalStatus): boolean {
  return status === 'completed';
}

/**
 * Calcula o progresso percentual de uma meta
 */
export function calculateProgress(completedTasks: number, totalTasks: number): number {
  if (totalTasks === 0) return 0;
  return Math.round((completedTasks / totalTasks) * 100);
}

/**
 * Calcula quantos dias faltam para o prazo
 */
export function getDaysRemaining(endDate: Date): number {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Formata mensagem de prazo
 */
export function formatDeadlineMessage(endDate: Date): string {
  const days = getDaysRemaining(endDate);
  
  if (days < 0) {
    return 'Vencida';
  } else if (days === 0) {
    return 'Vence hoje!';
  } else if (days === 1) {
    return '1 dia restante';
  } else {
    return `${days} dias restantes`;
  }
}

/**
 * Retorna informações de estilo para o status
 */
export function getStatusInfo(status: GoalStatus): {
  label: string;
  color: string;
  icon: string;
} {
  switch (status) {
    case 'in_progress':
      return {
        label: 'Em Andamento',
        color: '#2196F3',
        icon: 'arrow.right.circle.fill',
      };
    case 'completed':
      return {
        label: 'Concluída',
        color: '#4CAF50',
        icon: 'checkmark.circle.fill',
      };
    case 'completed_late':
      return {
        label: 'Concluída com Atraso',
        color: '#FF9800',
        icon: 'clock.badge.checkmark',
      };
    case 'expired':
      return {
        label: 'Expirada',
        color: '#9E9E9E',
        icon: 'xmark.circle.fill',
      };
  }
}
