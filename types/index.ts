// Tipos principais do aplicativo TaskHero

// Status possíveis de uma meta (conforme RN01-RN04)
export type GoalStatus = 'in_progress' | 'expired' | 'completed' | 'completed_late';

// Status possíveis de uma tarefa
export type TaskStatus = 'pending' | 'completed';

// Prioridade de tarefa
export type TaskPriority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  selectedAvatarId?: string; // ID do avatar de herói selecionado
  createdAt: Date;
  level: number;
  currentXP: number; // XP atual no nível
  xpToNextLevel: number; // XP necessário para próximo nível
  totalPoints: number;
  taskCoins: number; // Moedas para comprar avatares
  goalsCompletedOnTime: number; // Para cálculo de nível (RN04-RN05)
  goalsCompletedLate: number;
  goalsExpired: number;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  completedAt?: Date;
  status: GoalStatus;
  progress: number;
  totalTasks: number;
  completedTasks: number;
}

export interface Task {
  id: string;
  goalId: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  requirement: string;
  category: 'tasks' | 'goals' | 'streak' | 'level' | 'special';
}

export interface UserProgress {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalPoints: number;
  totalGoalsCompleted: number;
  totalTasksCompleted: number;
  currentStreak: number;
  longestStreak: number;
  badges: Badge[];
}

export interface Reward {
  id: string;
  type: 'theme' | 'avatar' | 'icon' | 'background';
  title: string;
  description: string;
  cost: number;
  unlocked: boolean;
  imageUrl?: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'reminder' | 'achievement' | 'deadline' | 'motivation';
  goalId?: string;
  taskId?: string;
  scheduledFor: Date;
  sent: boolean;
}

export interface Stats {
  todayTasksCompleted: number;
  weekTasksCompleted: number;
  monthTasksCompleted: number;
  activeGoals: number;
  completedGoals: number;
  totalXPEarned: number;
  averageCompletionRate: number;
}
