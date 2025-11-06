/**
 * Mock data for user badges/achievements
 */

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

/**
 * Todos os emblemas disponíveis no app
 * Este array contém tanto emblemas desbloqueados quanto bloqueados
 */
export const mockBadges: Badge[] = [
  {
    id: 'first_goal',
    title: 'Primeira Meta',
    description: 'Crie sua primeira meta',
    icon: 'flag.fill',
    unlocked: true,
    unlockedAt: new Date(2025, 0, 5),
  },
  {
    id: 'goal_master',
    title: 'Mestre das Metas',
    description: 'Complete uma meta inteira',
    icon: 'star.fill',
    unlocked: true,
    unlockedAt: new Date(2025, 0, 5),
  },
  {
    id: 'task_warrior',
    title: 'Guerreiro de Tarefas',
    description: 'Complete 10 tarefas',
    icon: 'checkmark.seal.fill',
    unlocked: true,
    unlockedAt: new Date(2025, 1, 10),
  },
  {
    id: 'task_champion',
    title: 'Campeão das Tarefas',
    description: 'Complete 50 tarefas',
    icon: 'bolt.fill',
    unlocked: true,
    unlockedAt: new Date(2025, 0, 5),
  },
  {
    id: 'week_streak',
    title: 'Persistente',
    description: 'Use o app por 7 dias seguidos',
    icon: 'flame.fill',
    unlocked: true,
    unlockedAt: new Date(2025, 0, 5),
  },
  {
    id: 'month_streak',
    title: 'Dedicado',
    description: 'Use o app por 30 dias seguidos',
    icon: 'flame.circle.fill',
    unlocked: false,
  },
  {
    id: 'level_5',
    title: 'Ascendente',
    description: 'Alcance o nível 5',
    icon: 'arrow.up.circle.fill',
    unlocked: false,
  },
  {
    id: 'level_10',
    title: 'Lendário',
    description: 'Alcance o nível 10',
    icon: 'crown.fill',
    unlocked: false,
  },
  {
    id: 'early_bird',
    title: 'Madrugador',
    description: 'Complete uma tarefa antes das 8h',
    icon: 'sunrise.fill',
    unlocked: false,
  },
  {
    id: 'night_owl',
    title: 'Coruja Noturna',
    description: 'Complete uma tarefa após as 22h',
    icon: 'moon.stars.fill',
    unlocked: false,
  },
];

/**
 * Retorna todos os emblemas (para tela de Recompensas)
 * Ordenados com os desbloqueados primeiro
 */
export function getAllBadges(): Badge[] {
  return [...mockBadges].sort((a, b) => {
    // Desbloqueados primeiro
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    return 0;
  });
}

/**
 * Retorna apenas os emblemas desbloqueados (para tela de Perfil)
 */
export function getUnlockedBadges(): Badge[] {
  return mockBadges.filter((badge) => badge.unlocked);
}

/**
 * Conta quantos emblemas foram desbloqueados
 */
export function getUnlockedBadgesCount(): number {
  return mockBadges.filter((badge) => badge.unlocked).length;
}

/**
 * Conta o total de emblemas disponíveis
 */
export function getTotalBadgesCount(): number {
  return mockBadges.length;
}
