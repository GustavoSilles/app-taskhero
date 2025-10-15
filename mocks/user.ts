// Dados mockados do usuário para desenvolvimento

import { User } from '@/types';

export const mockUser: User = {
  id: '1',
  name: 'Gustavo',
  email: 'gustavo@exemplo.com',
  avatarUrl: undefined,
  createdAt: new Date(2025, 0, 1), // 1 de janeiro de 2025
  level: 3,
  currentXP: 180,
  xpToNextLevel: 450,
  totalPoints: 450,
  taskCoins: 235, // Moedas para comprar avatares
  goalsCompletedOnTime: 4, // Para cálculo de nível (RN04-RN05)
  goalsCompletedLate: 2,
  goalsExpired: 1,
};

// Função para atualizar pontos do usuário
export function updateUserPoints(
  user: User,
  pointsToAdd: number
): User {
  return {
    ...user,
    totalPoints: user.totalPoints + pointsToAdd,
  };
}

// Função para atualizar nível do usuário
export function updateUserLevel(
  user: User,
  goalsCompletedOnTime: number
): User {
  // O nível é calculado automaticamente pela função calculateLevel
  // mas mantemos um contador das metas
  return {
    ...user,
    goalsCompletedOnTime,
  };
}
