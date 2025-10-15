// Dados mockados de tarefas para desenvolvimento

import { Task, TaskPriority, TaskStatus } from '@/types';

export const mockTasks: Task[] = [
  // Tarefas para Meta "Aprender React Native" (id: '1')
  {
    id: 't1',
    goalId: '1',
    title: 'Assistir módulo 1: Introdução ao React Native',
    description: 'Compreender os conceitos básicos e configurar ambiente',
    dueDate: new Date(2025, 8, 7),
    completed: true,
    completedAt: new Date(2025, 8, 5),
    priority: 'high' as TaskPriority,
    status: 'completed' as TaskStatus,
  },
  {
    id: 't2',
    goalId: '1',
    title: 'Completar exercícios do módulo 1',
    description: 'Fazer todos os exercícios práticos propostos',
    dueDate: new Date(2025, 8, 10),
    completed: true,
    completedAt: new Date(2025, 8, 9),
    priority: 'high' as TaskPriority,
    status: 'completed' as TaskStatus,
  },
  {
    id: 't3',
    goalId: '1',
    title: 'Assistir módulo 2: Componentes e Props',
    description: 'Aprender sobre componentes funcionais e props',
    dueDate: new Date(2025, 8, 15),
    completed: true,
    completedAt: new Date(2025, 8, 14),
    priority: 'high' as TaskPriority,
    status: 'completed' as TaskStatus,
  },
  {
    id: 't4',
    goalId: '1',
    title: 'Criar primeiro aplicativo: Lista de Tarefas',
    description: 'Desenvolver um app simples de lista de tarefas',
    dueDate: new Date(2025, 8, 25),
    completed: true,
    completedAt: new Date(2025, 8, 24),
    priority: 'medium' as TaskPriority,
    status: 'completed' as TaskStatus,
  },
  {
    id: 't5',
    goalId: '1',
    title: 'Assistir módulo 3: Navegação',
    description: 'Aprender React Navigation e diferentes tipos de navegadores',
    dueDate: new Date(2025, 9, 5),
    completed: false,
    priority: 'high' as TaskPriority,
    status: 'pending' as TaskStatus,
  },
  {
    id: 't6',
    goalId: '1',
    title: 'Implementar navegação no app de tarefas',
    description: 'Adicionar múltiplas telas com navegação',
    dueDate: new Date(2025, 9, 10),
    completed: false,
    priority: 'medium' as TaskPriority,
    status: 'pending' as TaskStatus,
  },
  {
    id: 't7',
    goalId: '1',
    title: 'Assistir módulo 4: Estado e Hooks',
    dueDate: new Date(2025, 9, 15),
    completed: false,
    priority: 'high' as TaskPriority,
    status: 'pending' as TaskStatus,
  },
  {
    id: 't8',
    goalId: '1',
    title: 'Criar segundo aplicativo: App de Receitas',
    dueDate: new Date(2025, 10, 1),
    completed: false,
    priority: 'medium' as TaskPriority,
    status: 'pending' as TaskStatus,
  },
  {
    id: 't9',
    goalId: '1',
    title: 'Assistir módulo 5: APIs e Integração',
    dueDate: new Date(2025, 10, 7),
    completed: false,
    priority: 'high' as TaskPriority,
    status: 'pending' as TaskStatus,
  },
  {
    id: 't10',
    goalId: '1',
    title: 'Criar terceiro aplicativo: App completo com backend',
    dueDate: new Date(2025, 10, 15),
    completed: false,
    priority: 'high' as TaskPriority,
    status: 'pending' as TaskStatus,
  },

  // Tarefas para Meta "Exercícios Físicos" (id: '2')
  {
    id: 't11',
    goalId: '2',
    title: 'Treino Segunda - Semana 1',
    completed: true,
    completedAt: new Date(2025, 8, 2),
    priority: 'high' as TaskPriority,
    status: 'completed' as TaskStatus,
  },
  {
    id: 't12',
    goalId: '2',
    title: 'Treino Quarta - Semana 1',
    completed: true,
    completedAt: new Date(2025, 8, 4),
    priority: 'high' as TaskPriority,
    status: 'completed' as TaskStatus,
  },
  {
    id: 't13',
    goalId: '2',
    title: 'Treino Sexta - Semana 1',
    completed: true,
    completedAt: new Date(2025, 8, 6),
    priority: 'high' as TaskPriority,
    status: 'completed' as TaskStatus,
  },
  {
    id: 't14',
    goalId: '2',
    title: 'Treino Sábado - Semana 1',
    completed: true,
    completedAt: new Date(2025, 8, 7),
    priority: 'medium' as TaskPriority,
    status: 'completed' as TaskStatus,
  },

  // Tarefas para Meta "Leitura de Livros" (id: '4')
  {
    id: 't15',
    goalId: '4',
    title: 'Ler "Hábitos Atômicos"',
    completed: true,
    completedAt: new Date(2025, 1, 15),
    priority: 'medium' as TaskPriority,
    status: 'completed' as TaskStatus,
  },
  {
    id: 't16',
    goalId: '4',
    title: 'Ler "O Poder do Hábito"',
    completed: true,
    completedAt: new Date(2025, 3, 20),
    priority: 'medium' as TaskPriority,
    status: 'completed' as TaskStatus,
  },
  {
    id: 't17',
    goalId: '4',
    title: 'Ler "Essencialismo"',
    completed: true,
    completedAt: new Date(2025, 6, 10),
    priority: 'medium' as TaskPriority,
    status: 'completed' as TaskStatus,
  },
  {
    id: 't18',
    goalId: '4',
    title: 'Ler "Deep Work"',
    dueDate: new Date(2025, 10, 30),
    completed: false,
    priority: 'medium' as TaskPriority,
    status: 'pending' as TaskStatus,
  },
];

// Função para obter tarefas de uma meta específica
export function getTasksByGoalId(goalId: string): Task[] {
  return mockTasks.filter((task) => task.goalId === goalId);
}

// Função para filtrar tarefas por status
export function filterTasksByStatus(
  tasks: Task[],
  completed: boolean
): Task[] {
  return tasks.filter((task) => task.completed === completed);
}

// Função para ordenar tarefas por prioridade
export function sortTasksByPriority(tasks: Task[]): Task[] {
  const priorityOrder: Record<TaskPriority, number> = {
    high: 1,
    medium: 2,
    low: 3,
  };
  
  return [...tasks].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );
}

// Função para ordenar tarefas por data de vencimento
export function sortTasksByDueDate(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.getTime() - b.dueDate.getTime();
  });
}

// Função para calcular estatísticas de tarefas
export function getTaskStatistics(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.filter((t) => !t.completed).length;
  
  const high = tasks.filter((t) => t.priority === 'high').length;
  const medium = tasks.filter((t) => t.priority === 'medium').length;
  const low = tasks.filter((t) => t.priority === 'low').length;
  
  const completionRate = total > 0 ? (completed / total) * 100 : 0;
  
  return {
    total,
    completed,
    pending,
    high,
    medium,
    low,
    completionRate: Math.round(completionRate),
  };
}
