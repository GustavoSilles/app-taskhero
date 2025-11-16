import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Goal, GoalStatus } from '@/types';
import { useAuth } from './auth-context';
import {
  listGoals,
  getGoalById as getGoalByIdAPI,
  createGoal as createGoalAPI,
  updateGoal as updateGoalAPI,
  deleteGoal as deleteGoalAPI,
  concludeGoal as concludeGoalAPI,
  CreateGoalRequest,
  UpdateGoalRequest,
  GoalResponse,
} from '@/services/api';
import { websocketService } from '@/services/websocket';

interface GoalsContextData {
  goals: Goal[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  fetchGoals: (page?: number, status?: string | null, sortField?: string, sortOrder?: string, append?: boolean) => Promise<void>;
  getGoalById: (goalId: string, forceRefresh?: boolean) => Promise<Goal>;
  createGoal: (data: CreateGoalRequest) => Promise<Goal>;
  updateGoal: (goalId: string, data: UpdateGoalRequest) => Promise<Goal>;
  deleteGoal: (goalId: string) => Promise<void>;
  concludeGoal: (goalId: string) => Promise<Goal>;
  refreshGoals: () => Promise<void>;
  selectedFilter: GoalStatus | 'all';
  selectedSort: 'data_fim' | 'createdAt' | 'progress_calculated' | 'status';
  setSelectedFilter: (filter: GoalStatus | 'all') => void;
  setSelectedSort: (sort: 'data_fim' | 'createdAt' | 'progress_calculated' | 'status') => void;
  hasInitialized: boolean;
}

const GoalsContext = createContext<GoalsContextData>({} as GoalsContextData);

export function GoalsProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedFilter, setSelectedFilterState] = useState<GoalStatus | 'all'>('all');
  const [selectedSort, setSelectedSortState] = useState<'data_fim' | 'createdAt' | 'progress_calculated' | 'status'>('createdAt');
  const [hasInitialized, setHasInitialized] = useState(false);

  const setSelectedFilter = useCallback((filter: GoalStatus | 'all') => {
    setSelectedFilterState(filter);
    setHasInitialized(false);
    setCurrentPage(1);
  }, []);

  const setSelectedSort = useCallback((sort: 'data_fim' | 'createdAt' | 'progress_calculated' | 'status') => {
    setSelectedSortState(sort);
    setHasInitialized(false);
    setCurrentPage(1);
  }, []);

  // Escuta notificações WebSocket de metas expiradas
  useEffect(() => {
    const unsubscribe = websocketService.subscribe((data) => {
      if (data.type === 'META_EXPIRADA' && data.meta_id) {
        // Atualiza a meta expirada na lista local
        setGoals(prev => 
          prev.map(goal => 
            goal.id === data.meta_id?.toString()
              ? { ...goal, status: 'expired' as GoalStatus }
              : goal
          )
        );
      }
    });

    return unsubscribe;
  }, []);

  const convertBackendGoalToFrontend = (backendGoal: any): Goal => {
    if (!backendGoal) {
      throw new Error('Meta do backend está undefined');
    }

    if (!backendGoal.id) {
      throw new Error('Meta sem ID: ' + JSON.stringify(backendGoal));
    }

    const startDate = new Date(backendGoal.data_inicio);
    const endDate = new Date(backendGoal.data_fim);
    const createdAt = new Date(backendGoal.createdAt);
    const completedAt = backendGoal.status === 'CONCLUIDO' || backendGoal.status === 'CONCLUIDO_COM_ATRASO'
      ? new Date(backendGoal.updatedAt)
      : undefined;

    // Mapeia status do backend para frontend
    let status: GoalStatus;
    switch (backendGoal.status) {
      case 'CONCLUIDO':
        status = 'completed';
        break;
      case 'CONCLUIDO_COM_ATRASO':
        status = 'completed_late';
        break;
      case 'EXPIRADO':
        status = 'expired';
        break;
      default:
        status = 'in_progress';
    }

    // Calcula progresso
    const totalTasks = backendGoal.tarefas?.length || 0;
    const completedTasks = backendGoal.tarefas?.filter((t: any) => t.status === 'CONCLUIDO').length || 0;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      id: backendGoal.id.toString(),
      userId: (backendGoal.usuario_id || backendGoal.usuarioId || 0).toString(),
      title: backendGoal.titulo || '',
      description: backendGoal.descricao || '',
      startDate,
      endDate,
      createdAt,
      completedAt,
      status,
      progress,
      totalTasks,
      completedTasks,
    };
  };

  const fetchGoals = useCallback(async (
    page: number = 1, 
    status: string | null = null,
    sortField: string = 'createdAt',
    sortOrder: string = 'DESC',
    append: boolean = false
  ) => {
    if (!token) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await listGoals(token, page, status, sortField, sortOrder);
      
      if (!response.data || !response.data.metas) {
        console.error('GoalsContext - Resposta inválida do backend:', response);
        setGoals([]);
        return;
      }

      const convertedGoals = response.data.metas.map(convertBackendGoalToFrontend);
      
      // Se append=true, adiciona ao final removendo duplicatas
      if (append) {
        setGoals(prev => {
          // Cria um Map para garantir IDs únicos
          const goalsMap = new Map(prev.map(g => [g.id, g]));
          // Adiciona/atualiza com as novas metas
          convertedGoals.forEach(g => goalsMap.set(g.id, g));
          // Retorna array sem duplicatas
          return Array.from(goalsMap.values());
        });
      } else {
        setGoals(convertedGoals);
      }
      
      setCurrentPage(response.data.page || page);
      setTotalPages(response.data.totalPages || 1);
      setTotalItems(response.data.totalMetas || 0);
      setHasInitialized(true);
    } catch (error: any) {
      console.error('GoalsContext - Erro ao buscar metas:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const createGoal = useCallback(async (data: CreateGoalRequest): Promise<Goal> => {
    if (!token) throw new Error('Usuário não autenticado');

    setIsLoading(true);
    try {
      const response = await createGoalAPI(token, data);
      const metaData = response.data || response;
      
      if (!metaData) {
        throw new Error('Dados da meta não encontrados na resposta');
      }

      const newGoal = convertBackendGoalToFrontend(metaData);
      
      setGoals(prev => [newGoal, ...prev]);
      setTotalItems(prev => prev + 1);

      return newGoal;
    } catch (error: any) {
      console.error('GoalsContext - Erro ao criar meta:', error);
      console.error('GoalsContext - Detalhes do erro:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const updateGoal = useCallback(async (goalId: string, data: UpdateGoalRequest): Promise<Goal> => {
    if (!token) throw new Error('Usuário não autenticado');

    try {
      const response = await updateGoalAPI(token, parseInt(goalId), data);
      const updatedGoal = convertBackendGoalToFrontend(response.data);
      
      // Atualiza a meta no array local se ela existir
      setGoals(prev => {
        const exists = prev.some(g => g.id === goalId);
        if (exists) {
          return prev.map(g => g.id === goalId ? updatedGoal : g);
        }
        return prev;
      });

      return updatedGoal;
    } catch (error) {
      console.error('GoalsContext - Erro ao atualizar meta:', error);
      throw error;
    }
  }, [token]);

  const deleteGoal = useCallback(async (goalId: string): Promise<void> => {
    if (!token) throw new Error('Usuário não autenticado');

    setIsLoading(true);
    try {
      await deleteGoalAPI(token, parseInt(goalId));
      
      setGoals(prev => prev.filter(g => g.id !== goalId));
      setTotalItems(prev => prev - 1);
    } catch (error) {
      console.error('GoalsContext - Erro ao deletar meta:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const concludeGoal = useCallback(async (goalId: string): Promise<Goal> => {
    if (!token) throw new Error('Usuário não autenticado');

    try {
      const response = await concludeGoalAPI(token, parseInt(goalId));
      const concludedGoal = convertBackendGoalToFrontend(response.data);
      
      // Atualiza a meta no array local se ela existir
      setGoals(prev => {
        const exists = prev.some(g => g.id === goalId);
        if (exists) {
          return prev.map(g => g.id === goalId ? concludedGoal : g);
        }
        return prev;
      });

      return concludedGoal;
    } catch (error) {
      console.error('GoalsContext - Erro ao concluir meta:', error);
      throw error;
    }
  }, [token]);

  const refreshGoals = useCallback(async () => {
    const status = selectedFilter === 'all' ? null : selectedFilter;
    await fetchGoals(currentPage, status, selectedSort, 'DESC', false);
  }, [fetchGoals, currentPage, selectedFilter, selectedSort]);

  const getGoalById = useCallback(async (goalId: string, forceRefresh: boolean = false): Promise<Goal> => {
    if (!token) throw new Error('Usuário não autenticado');

    // Se forceRefresh for false, tenta encontrar no cache local
    if (!forceRefresh) {
      const localGoal = goals.find(g => g.id === goalId);
      if (localGoal) {
        return localGoal;
      }
    }

    // Busca do backend (se forceRefresh=true ou não encontrou localmente)
    try {
      const response = await getGoalByIdAPI(token, parseInt(goalId));
      const goal = convertBackendGoalToFrontend(response.data);
      
      // Atualiza a meta no array local se ela já existir
      setGoals(prev => {
        const exists = prev.some(g => g.id === goalId);
        if (exists) {
          return prev.map(g => g.id === goalId ? goal : g);
        }
        return prev;
      });
      
      return goal;
    } catch (error) {
      console.error('Erro ao buscar meta por ID:', error);
      throw error;
    }
  }, [token, goals]);

  return (
    <GoalsContext.Provider
      value={{
        goals,
        isLoading,
        currentPage,
        totalPages,
        totalItems,
        fetchGoals,
        getGoalById,
        createGoal,
        updateGoal,
        deleteGoal,
        concludeGoal,
        refreshGoals,
        selectedFilter,
        selectedSort,
        setSelectedFilter,
        setSelectedSort,
        hasInitialized,
      }}>
      {children}
    </GoalsContext.Provider>
  );
}

export function useGoals() {
  const context = useContext(GoalsContext);
  if (!context) {
    throw new Error('useGoals deve ser usado dentro de um GoalsProvider');
  }
  return context;
}
