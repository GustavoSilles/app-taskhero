// Funções utilitárias para cálculo de nível do usuário
// Baseado em XP (Experience Points)

/**
 * Sistema de Níveis baseado em XP Balanceado:
 * - XP necessário = 100 * nível_atual
 * - Nível 1→2: 100 XP
 * - Nível 2→3: 200 XP
 * - Nível 3→4: 300 XP
 * - Nível 4→5: 400 XP
 * 
 * Como ganhar XP:
 * - Tarefa concluída: +10 XP
 * - Meta concluída no prazo: +100 XP
 * - Meta concluída com atraso: 0 XP
 */

/**
 * Calcula o nível atual baseado no XP total
 */
export function calculateLevel(xpPoints: number): number {
  let level = 1;
  let xpNeeded = 100;
  let remainingXP = xpPoints;

  while (remainingXP >= xpNeeded) {
    remainingXP -= xpNeeded;
    level++;
    xpNeeded = 100 * level;
  }

  return level;
}

/**
 * Retorna quanto XP é necessário para alcançar o próximo nível
 */
export function getXPForNextLevel(currentLevel: number): number {
  return 100 * currentLevel;
}

/**
 * Retorna quanto XP do nível atual o usuário tem
 */
export function getXPInCurrentLevel(xpPoints: number): number {
  let level = 1;
  let xpNeeded = 100;
  let remainingXP = xpPoints;

  while (remainingXP >= xpNeeded) {
    remainingXP -= xpNeeded;
    level++;
    xpNeeded = 100 * level;
  }

  return remainingXP;
}

/**
 * Retorna quanto XP falta para o próximo nível
 */
export function getXPUntilNextLevel(xpPoints: number): number {
  const currentLevel = calculateLevel(xpPoints);
  const xpInCurrentLevel = getXPInCurrentLevel(xpPoints);
  const xpNeeded = getXPForNextLevel(currentLevel);
  return xpNeeded - xpInCurrentLevel;
}

/**
 * Calcula o progresso percentual até o próximo nível
 */
export function getLevelProgress(xpPoints: number): number {
  const currentLevel = calculateLevel(xpPoints);
  const xpInCurrentLevel = getXPInCurrentLevel(xpPoints);
  const xpNeeded = getXPForNextLevel(currentLevel);
  const progress = (xpInCurrentLevel / xpNeeded) * 100;
  return Math.min(100, Math.max(0, progress));
}

/**
 * Retorna informações completas sobre o progresso de nível
 */
export function getLevelInfo(xpPoints: number) {
  const level = calculateLevel(xpPoints);
  const xpForNext = getXPForNextLevel(level);
  const xpInCurrentLevel = getXPInCurrentLevel(xpPoints);
  const xpRemaining = getXPUntilNextLevel(xpPoints);
  const progress = getLevelProgress(xpPoints);
  
  return {
    level,
    xpForNext,
    xpRemaining,
    progress,
    currentXP: xpPoints,
    xpInCurrentLevel,
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
  
  if (level <= names.length) {
    return names[level - 1];
  }
  
  return `Nível ${level}`;
}
