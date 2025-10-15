// Funções utilitárias para cálculo de nível do usuário
// Baseado na Regra de Negócio RN05

/**
 * RN05: Escala de progressão de níveis
 * Baseado APENAS em metas concluídas dentro do prazo
 * 
 * Nível 1: 1 meta concluída
 * Nível 2: 2 metas concluídas
 * Nível 3: 4 metas concluídas
 * Nível 4: 6 metas concluídas
 * Nível 5: 8 metas concluídas
 * Nível 6: 10 metas concluídas
 * Nível 7: 12 metas concluídas
 */
const LEVEL_THRESHOLDS = [0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

/**
 * Calcula o nível atual baseado no número de metas concluídas no prazo
 */
export function calculateLevel(goalsCompletedOnTime: number): number {
  let level = 1;
  
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (goalsCompletedOnTime >= LEVEL_THRESHOLDS[i]) {
      level = i;
      break;
    }
  }
  
  return level;
}

/**
 * Retorna quantas metas são necessárias para alcançar o próximo nível
 */
export function getGoalsForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_THRESHOLDS.length - 1) {
    // Se está no nível máximo, continua com incremento de 2
    const maxThreshold = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    const increment = (currentLevel - (LEVEL_THRESHOLDS.length - 1)) + 1;
    return maxThreshold + (increment * 2);
  }
  
  return LEVEL_THRESHOLDS[currentLevel + 1];
}

/**
 * Retorna quantas metas faltam para o próximo nível
 */
export function getGoalsUntilNextLevel(
  currentLevel: number,
  goalsCompletedOnTime: number
): number {
  const goalsNeeded = getGoalsForNextLevel(currentLevel);
  const remaining = goalsNeeded - goalsCompletedOnTime;
  return Math.max(0, remaining);
}

/**
 * Calcula o progresso percentual até o próximo nível
 */
export function getLevelProgress(
  currentLevel: number,
  goalsCompletedOnTime: number
): number {
  if (currentLevel === 0) return 0;
  
  const currentThreshold = LEVEL_THRESHOLDS[currentLevel];
  const nextThreshold = getGoalsForNextLevel(currentLevel);
  
  const goalsInCurrentLevel = goalsCompletedOnTime - currentThreshold;
  const goalsNeededForLevel = nextThreshold - currentThreshold;
  
  const progress = (goalsInCurrentLevel / goalsNeededForLevel) * 100;
  return Math.min(100, Math.max(0, progress));
}

/**
 * Retorna informações completas sobre o progresso de nível
 */
export function getLevelInfo(goalsCompletedOnTime: number) {
  const level = calculateLevel(goalsCompletedOnTime);
  const goalsForNext = getGoalsForNextLevel(level);
  const goalsRemaining = getGoalsUntilNextLevel(level, goalsCompletedOnTime);
  const progress = getLevelProgress(level, goalsCompletedOnTime);
  
  return {
    level,
    goalsForNext,
    goalsRemaining,
    progress,
    currentGoals: goalsCompletedOnTime,
  };
}

/**
 * Retorna uma mensagem motivacional baseada no progresso
 */
export function getMotivationalMessage(progress: number): string {
  if (progress < 25) {
    return 'Você está começando! Continue assim!';
  } else if (progress < 50) {
    return 'Bom progresso! Você está no caminho certo!';
  } else if (progress < 75) {
    return 'Quase lá! Continue focado!';
  } else if (progress < 100) {
    return 'Falta pouco para o próximo nível!';
  } else {
    return 'Nível completo! Parabéns!';
  }
}

/**
 * Retorna o nome do nível baseado no número
 */
export function getLevelName(level: number): string {
  const names = [
    'Iniciante',
    'Aprendiz',
    'Dedicado',
    'Focado',
    'Persistente',
    'Experiente',
    'Veterano',
    'Mestre',
    'Campeão',
    'Lendário',
    'Épico',
  ];
  
  if (level < names.length) {
    return names[level];
  }
  
  return `Nível ${level}`;
}
