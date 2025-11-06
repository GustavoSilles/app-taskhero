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
  {
    id: '7',
    userId: '1',
    title: 'Aprender TypeScript',
    description: 'Dominar TypeScript avançado incluindo generics, decorators e utility types',
    startDate: new Date(2025, 9, 1), // 1 de outubro de 2025
    endDate: new Date(2025, 11, 15), // 15 de dezembro de 2025
    status: 'in_progress' as GoalStatus,
    progress: 35,
    totalTasks: 15,
    completedTasks: 5,
  },
  {
    id: '8',
    userId: '1',
    title: 'Economizar Dinheiro',
    description: 'Guardar R$ 10.000 em 6 meses para viagem',
    startDate: new Date(2025, 8, 1),
    endDate: new Date(2026, 1, 28),
    status: 'in_progress' as GoalStatus,
    progress: 55,
    totalTasks: 6,
    completedTasks: 3,
  },
  {
    id: '9',
    userId: '1',
    title: 'Certificação AWS',
    description: 'Obter certificação AWS Solutions Architect Associate',
    startDate: new Date(2025, 7, 1),
    endDate: new Date(2025, 10, 30),
    status: 'in_progress' as GoalStatus,
    progress: 80,
    totalTasks: 20,
    completedTasks: 16,
  },
  {
    id: '10',
    userId: '1',
    title: 'Aprender Inglês',
    description: 'Atingir nível C1 de proficiência em inglês',
    startDate: new Date(2025, 0, 1),
    endDate: new Date(2025, 11, 31),
    status: 'in_progress' as GoalStatus,
    progress: 65,
    totalTasks: 52,
    completedTasks: 34,
  },
  {
    id: '11',
    userId: '1',
    title: 'Criar Blog Pessoal',
    description: 'Desenvolver e publicar blog com 50 artigos sobre programação',
    startDate: new Date(2025, 8, 1),
    endDate: new Date(2026, 2, 31),
    status: 'in_progress' as GoalStatus,
    progress: 20,
    totalTasks: 50,
    completedTasks: 10,
  },
  {
    id: '12',
    userId: '1',
    title: 'Meditação Diária',
    description: 'Meditar 15 minutos todos os dias durante 90 dias',
    startDate: new Date(2025, 9, 1),
    endDate: new Date(2025, 11, 30),
    status: 'in_progress' as GoalStatus,
    progress: 40,
    totalTasks: 90,
    completedTasks: 36,
  },
  {
    id: '13',
    userId: '1',
    title: 'Networking Profissional',
    description: 'Participar de 10 eventos de tecnologia e fazer 50 conexões no LinkedIn',
    startDate: new Date(2025, 8, 1),
    endDate: new Date(2025, 11, 31),
    status: 'in_progress' as GoalStatus,
    progress: 30,
    totalTasks: 60,
    completedTasks: 18,
  },
  {
    id: '14',
    userId: '1',
    title: 'Portfólio Online',
    description: 'Criar site portfólio profissional com 10 projetos',
    startDate: new Date(2025, 7, 15),
    endDate: new Date(2025, 9, 15),
    completedAt: new Date(2025, 9, 10),
    status: 'completed' as GoalStatus,
    progress: 100,
    totalTasks: 10,
    completedTasks: 10,
  },
  {
    id: '15',
    userId: '1',
    title: 'Curso de Docker',
    description: 'Completar curso de Docker e Kubernetes',
    startDate: new Date(2025, 6, 1),
    endDate: new Date(2025, 8, 30),
    completedAt: new Date(2025, 8, 25),
    status: 'completed' as GoalStatus,
    progress: 100,
    totalTasks: 12,
    completedTasks: 12,
  },
  {
    id: '16',
    userId: '1',
    title: 'Contribuir Open Source',
    description: 'Fazer 20 contribuições significativas em projetos open source',
    startDate: new Date(2025, 8, 1),
    endDate: new Date(2026, 2, 31),
    status: 'in_progress' as GoalStatus,
    progress: 15,
    totalTasks: 20,
    completedTasks: 3,
  },
  {
    id: '17',
    userId: '1',
    title: 'Rotina de Sono',
    description: 'Dormir 8 horas por dia durante 60 dias consecutivos',
    startDate: new Date(2025, 9, 1),
    endDate: new Date(2025, 10, 30),
    status: 'in_progress' as GoalStatus,
    progress: 50,
    totalTasks: 60,
    completedTasks: 30,
  },
  {
    id: '18',
    userId: '1',
    title: 'Aprender Piano',
    description: 'Tocar 5 músicas completas no piano',
    startDate: new Date(2025, 5, 1),
    endDate: new Date(2025, 8, 30),
    status: 'expired' as GoalStatus,
    progress: 40,
    totalTasks: 5,
    completedTasks: 2,
  },
  {
    id: '19',
    userId: '1',
    title: 'Desafio 100 Dias de Código',
    description: 'Programar pelo menos 1 hora todos os dias durante 100 dias',
    startDate: new Date(2025, 7, 1),
    endDate: new Date(2025, 10, 9),
    status: 'in_progress' as GoalStatus,
    progress: 75,
    totalTasks: 100,
    completedTasks: 75,
  },
  {
    id: '20',
    userId: '1',
    title: 'Alimentação Saudável',
    description: 'Seguir dieta balanceada e preparar refeições em casa 5x por semana',
    startDate: new Date(2025, 9, 1),
    endDate: new Date(2025, 11, 31),
    status: 'in_progress' as GoalStatus,
    progress: 60,
    totalTasks: 40,
    completedTasks: 24,
  },
  {
    id: '21',
    userId: '1',
    title: 'Startup MVP',
    description: 'Desenvolver MVP de aplicativo de produtividade',
    startDate: new Date(2025, 6, 1),
    endDate: new Date(2025, 9, 31),
    completedAt: new Date(2025, 10, 5),
    status: 'completed_late' as GoalStatus,
    progress: 100,
    totalTasks: 25,
    completedTasks: 25,
  },
  {
    id: '22',
    userId: '1',
    title: 'Voluntariado',
    description: 'Ensinar programação para 30 iniciantes em projeto social',
    startDate: new Date(2025, 8, 1),
    endDate: new Date(2026, 1, 28),
    status: 'in_progress' as GoalStatus,
    progress: 45,
    totalTasks: 30,
    completedTasks: 13,
  },
  {
    id: '23',
    userId: '1',
    title: 'Maratona de Corrida',
    description: 'Treinar e completar primeira meia maratona',
    startDate: new Date(2025, 8, 1),
    endDate: new Date(2026, 3, 30),
    status: 'in_progress' as GoalStatus,
    progress: 30,
    totalTasks: 80,
    completedTasks: 24,
  },
  {
    id: '24',
    userId: '1',
    title: 'Podcast Semanal',
    description: 'Gravar e publicar 20 episódios de podcast sobre tecnologia',
    startDate: new Date(2025, 7, 1),
    endDate: new Date(2025, 11, 31),
    status: 'in_progress' as GoalStatus,
    progress: 55,
    totalTasks: 20,
    completedTasks: 11,
  },
  {
    id: '25',
    userId: '1',
    title: 'Design UI/UX',
    description: 'Dominar Figma e criar 15 protótipos de interfaces',
    startDate: new Date(2025, 9, 1),
    endDate: new Date(2026, 0, 31),
    status: 'in_progress' as GoalStatus,
    progress: 25,
    totalTasks: 15,
    completedTasks: 4,
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
