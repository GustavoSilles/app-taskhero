// Dados mockados de metas para desenvolvimento

import { Goal, GoalStatus } from '@/types';

export const mockGoals: Goal[] = [
  {
    id: '1',
    userId: '1',
    title: 'Aprender React Native',
    description: 'Completar curso completo e desenvolver 3 aplicativos práticos para portfólio',
    startDate: new Date(2025, 8, 1), // 1 de setembro de 2025
    endDate: new Date(2025, 10, 15), // 15 de novembro de 2025
    status: 'in_progress' as GoalStatus,
    progress: 45,
    totalTasks: 10,
    completedTasks: 4,
  },
  {
    id: '2',
    userId: '1',
    title: 'Exercícios Físicos',
    description: 'Treinar 4 vezes por semana durante 3 meses para melhorar condicionamento',
    startDate: new Date(2025, 8, 1),
    endDate: new Date(2025, 11, 1), // 1 de dezembro de 2025
    status: 'in_progress' as GoalStatus,
    progress: 70,
    totalTasks: 48,
    completedTasks: 34,
  },
  {
    id: '3',
    userId: '1',
    title: 'Projeto Concluído no Prazo',
    description: 'Meta de exemplo que foi concluída dentro do prazo estabelecido',
    startDate: new Date(2025, 7, 1), // 1 de agosto de 2025
    endDate: new Date(2025, 8, 30), // 30 de setembro de 2025
    completedAt: new Date(2025, 8, 28), // Concluída 2 dias antes
    status: 'completed' as GoalStatus,
    progress: 100,
    totalTasks: 8,
    completedTasks: 8,
  },
  {
    id: '4',
    userId: '1',
    title: 'Leitura de Livros',
    description: 'Ler 12 livros durante o ano de 2025',
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 11, 31),
    status: 'in_progress' as GoalStatus,
    progress: 25,
    totalTasks: 12,
    completedTasks: 3,
  },
  {
    id: '5',
    userId: '1',
    title: 'Meta Concluída com Atraso',
    description: 'Esta meta foi concluída mas passou do prazo estabelecido',
    startDate: new Date(2025, 6, 1), // 1 de julho de 2025
    endDate: new Date(2025, 7, 31), // 31 de agosto de 2025
    completedAt: new Date(2025, 8, 5), // Concluída 5 dias após o prazo
    status: 'completed_late' as GoalStatus,
    progress: 100,
    totalTasks: 5,
    completedTasks: 5,
  },
  {
    id: '6',
    userId: '1',
    title: 'Meta Expirada',
    description: 'Esta meta não foi concluída dentro do prazo e expirou',
    startDate: new Date(2025, 5, 1), // 1 de junho de 2025
    endDate: new Date(2025, 6, 30), // 30 de julho de 2025
    status: 'expired' as GoalStatus,
    progress: 60,
    totalTasks: 10,
    completedTasks: 6,
  },
];

// Função para filtrar metas por status
export function filterGoalsByStatus(
  goals: Goal[],
  status: GoalStatus | 'all'
): Goal[] {
  if (status === 'all') {
    return goals;
  }
  return goals.filter((goal) => goal.status === status);
}

// Função para ordenar metas
export function sortGoals(
  goals: Goal[],
  sortBy: 'deadline' | 'created' | 'progress' | 'status'
): Goal[] {
  const sorted = [...goals];
  
  switch (sortBy) {
    case 'deadline':
      return sorted.sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
    
    case 'created':
      return sorted.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
    
    case 'progress':
      return sorted.sort((a, b) => b.progress - a.progress);
    
    case 'status':
      const statusOrder: Record<GoalStatus, number> = {
        in_progress: 1,
        completed: 2,
        completed_late: 3,
        expired: 4,
      };
      return sorted.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
    
    default:
      return sorted;
  }
}

// Função para obter estatísticas das metas
export function getGoalStatistics(goals: Goal[]) {
  const total = goals.length;
  const inProgress = goals.filter((g) => g.status === 'in_progress').length;
  const completed = goals.filter((g) => g.status === 'completed').length;
  const completedLate = goals.filter((g) => g.status === 'completed_late').length;
  const expired = goals.filter((g) => g.status === 'expired').length;
  
  const totalCompleted = completed + completedLate;
  const completionRate = total > 0 ? (totalCompleted / total) * 100 : 0;
  
  const onTimeRate = totalCompleted > 0 ? (completed / totalCompleted) * 100 : 0;
  
  return {
    total,
    inProgress,
    completed,
    completedLate,
    expired,
    totalCompleted,
    completionRate: Math.round(completionRate),
    onTimeRate: Math.round(onTimeRate),
  };
}
