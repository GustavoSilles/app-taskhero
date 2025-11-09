// Hook customizado para acessar dados de gamificação atualizados em tempo real

import { useAuth } from '@/contexts/auth-context';

export function useGamification() {
  const { user } = useAuth();

  // currentXP é o XP dentro do nível atual (reseta a cada nível)
  // xpToNextLevel é quanto precisa para o próximo nível (100, 200, 300, 400...)
  // progressToNextLevel é a porcentagem do progresso
  const progressToNextLevel = user?.xpToNextLevel 
    ? Math.round((user.currentXP / user.xpToNextLevel) * 100)
    : 0;

  return {
    level: user?.level ?? 1,
    currentXP: user?.currentXP ?? 0,
    xpToNextLevel: user?.xpToNextLevel ?? 100,
    taskCoins: user?.taskCoins ?? 0,
    totalPoints: user?.totalPoints ?? 0,
    progressToNextLevel,
  };
}
