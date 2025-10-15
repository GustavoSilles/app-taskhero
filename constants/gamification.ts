// Constantes do sistema de gamificação

export const XP_REWARDS = {
  TASK_COMPLETED: 10,
  GOAL_COMPLETED: 100,
  FIRST_TASK: 20,
  FIRST_GOAL: 50,
  STREAK_BONUS: 5, // Por dia de streak
  LEVEL_UP_BONUS: 25,
} as const;

export const POINT_REWARDS = {
  TASK_COMPLETED: 5,
  GOAL_COMPLETED: 50,
  BADGE_UNLOCKED: 25,
  LEVEL_UP: 25,
  DAILY_LOGIN: 2,
  PERFECT_DAY: 20, // Completar todas as tarefas do dia
} as const;

export const TASKCOIN_REWARDS = {
  TASK_COMPLETED: 10,
  GOAL_COMPLETED: 50,
  LEVEL_UP: 25,
  BADGE_UNLOCKED: 15,
  PERFECT_DAY: 30, // Completar todas as tarefas do dia
} as const;

export const AVATAR_COSTS = {
  COMMON: 50, // Avatares comuns
  RARE: 100, // Avatares raros
  EPIC: 200, // Avatares épicos
  LEGENDARY: 500, // Avatares lendários
} as const;

export const LEVEL_REQUIREMENTS = [
  0, 100, 250, 450, 700, 1000, 1400, 1850, 2400, 3000, 3700, 4500, 5400, 6400,
  7500, 8700, 10000, 11400, 12900, 14500, 16200,
];

export const BADGE_REQUIREMENTS = {
  FIRST_GOAL: {
    id: 'first_goal',
    title: 'Primeira Meta',
    description: 'Crie sua primeira meta',
    icon: 'flag.fill',
    requirement: 'Criar 1 meta',
    category: 'goals' as const,
  },
  GOAL_MASTER: {
    id: 'goal_master',
    title: 'Mestre das Metas',
    description: 'Complete uma meta inteira',
    icon: 'star.fill',
    requirement: 'Completar 1 meta',
    category: 'goals' as const,
  },
  TASK_WARRIOR: {
    id: 'task_warrior',
    title: 'Guerreiro de Tarefas',
    description: 'Complete 10 tarefas',
    icon: 'checkmark.seal.fill',
    requirement: 'Completar 10 tarefas',
    category: 'tasks' as const,
  },
  TASK_CHAMPION: {
    id: 'task_champion',
    title: 'Campeão das Tarefas',
    description: 'Complete 50 tarefas',
    icon: 'bolt.fill',
    requirement: 'Completar 50 tarefas',
    category: 'tasks' as const,
  },
  WEEK_STREAK: {
    id: 'week_streak',
    title: 'Persistente',
    description: 'Use o app por 7 dias seguidos',
    icon: 'flame.fill',
    requirement: '7 dias de streak',
    category: 'streak' as const,
  },
  MONTH_STREAK: {
    id: 'month_streak',
    title: 'Dedicado',
    description: 'Use o app por 30 dias seguidos',
    icon: 'flame.circle.fill',
    requirement: '30 dias de streak',
    category: 'streak' as const,
  },
  LEVEL_5: {
    id: 'level_5',
    title: 'Ascendente',
    description: 'Alcance o nível 5',
    icon: 'arrow.up.circle.fill',
    requirement: 'Alcançar nível 5',
    category: 'level' as const,
  },
  LEVEL_10: {
    id: 'level_10',
    title: 'Lendário',
    description: 'Alcance o nível 10',
    icon: 'crown.fill',
    requirement: 'Alcançar nível 10',
    category: 'level' as const,
  },
  EARLY_BIRD: {
    id: 'early_bird',
    title: 'Madrugador',
    description: 'Complete uma tarefa antes das 8h',
    icon: 'sunrise.fill',
    requirement: 'Completar tarefa antes das 8h',
    category: 'special' as const,
  },
  NIGHT_OWL: {
    id: 'night_owl',
    title: 'Coruja Noturna',
    description: 'Complete uma tarefa após as 22h',
    icon: 'moon.stars.fill',
    requirement: 'Completar tarefa após as 22h',
    category: 'special' as const,
  },
} as const;

export const MOTIVATIONAL_MESSAGES = {
  LOW_PROGRESS: [
    'Todo grande sonho começa com um primeiro passo!',
    'Você está no caminho certo, continue!',
    'Cada tarefa concluída é uma vitória!',
  ],
  MEDIUM_PROGRESS: [
    'Ótimo trabalho! Você está progredindo muito bem!',
    'Continue assim! O sucesso está próximo!',
    'Sua dedicação está fazendo a diferença!',
  ],
  HIGH_PROGRESS: [
    'Uau! Você está quase lá!',
    'Incrível! Falta muito pouco agora!',
    'Você é imparável! Continue!',
  ],
  GOAL_COMPLETED: [
    '🎉 Parabéns! Você conquistou sua meta!',
    '⭐ Fantástico! Meta concluída com sucesso!',
    '🏆 Você é incrível! Meta cumprida!',
  ],
  LEVEL_UP: [
    '🎊 Level Up! Você subiu de nível!',
    '⚡ Parabéns! Novo nível alcançado!',
    '🌟 Você evoluiu! Continue crescendo!',
  ],
} as const;

export const PRIORITY_COLORS = {
  low: '#4caf50',
  medium: '#ffaa00',
  high: '#ff4444',
} as const;

export const CATEGORY_ICONS = {
  work: 'briefcase.fill',
  personal: 'person.fill',
  health: 'heart.fill',
  education: 'book.fill',
  finance: 'dollarsign.circle.fill',
  hobby: 'paintbrush.fill',
  other: 'folder.fill',
} as const;
