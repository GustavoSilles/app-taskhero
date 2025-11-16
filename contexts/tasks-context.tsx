import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus } from '@/types';
import { useAuth } from './auth-context';
import {
  listTasks,
  createTask as createTaskAPI,
  updateTask as updateTaskAPI,
  deleteTask as deleteTaskAPI,
  concludeTask as concludeTaskAPI,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskResponse,
} from '@/services/api';

interface TasksContextData {
  tasks: Task[];
  isLoading: boolean;
  fetchTasks: (goalId: string, filters?: { status?: string; prioridade?: string }) => Promise<void>;
  createTask: (goalId: string, data: CreateTaskRequest) => Promise<void>;
  updateTask: (goalId: string, taskId: string, data: UpdateTaskRequest) => Promise<Task>;
  deleteTask: (goalId: string, taskId: string) => Promise<void>;
  concludeTask: (goalId: string, taskId: string) => Promise<Task>;
  refreshTasks: (goalId: string) => Promise<void>;
}

const TasksContext = createContext<TasksContextData>({} as TasksContextData);

export function TasksProvider({ children }: { children: ReactNode }) {
  const { token, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Limpa as tarefas quando o usuário faz logout ou troca de conta
  useEffect(() => {
    if (!user || !token) {
      console.log('TasksContext - Limpando tarefas (usuário deslogado ou token removido)');
      setTasks([]);
    }
  }, [user, token]);

  const convertBackendTaskToFrontend = (backendTask: any): Task => {
    if (!backendTask || !backendTask.id) {
      throw new Error('Tarefa sem ID');
    }

    // O backend pode retornar em dois formatos:
    // 1. Formato bruto do Sequelize: { id, titulo, meta_id, prioridade, status, ... }
    // 2. Formato customizado do repository: { id, title, goalId, priority, status, ... }
    
    const id = backendTask.id;
    const goalId = backendTask.goalId || backendTask.meta_id;
    const title = backendTask.title || backendTask.titulo;
    const completed = backendTask.completed !== undefined 
      ? backendTask.completed 
      : backendTask.status === 'CONCLUIDO';
    
    const completedAt = backendTask.completedAt 
      ? new Date(backendTask.completedAt)
      : (backendTask.status === 'CONCLUIDO' && backendTask.updatedAt)
        ? new Date(backendTask.updatedAt)
        : undefined;

    // Mapeia prioridade
    const backendPriority = backendTask.priority || backendTask.prioridade;
    let priority: TaskPriority;
    switch (backendPriority) {
      case 'BAIXA':
        priority = 'low';
        break;
      case 'ALTA':
        priority = 'high';
        break;
      case 'MEDIA':
      default:
        priority = 'medium';
    }

    // Mapeia status
    const backendStatus = backendTask.status;
    const status: TaskStatus = backendStatus === 'CONCLUIDO' ? 'completed' : 'pending';

    if (!goalId) {
      throw new Error('Tarefa sem goalId');
    }

    return {
      id: id.toString(),
      goalId: goalId.toString(),
      title: title || '',
      completed,
      completedAt,
      priority,
      status,
    };
  };

  const fetchTasks = useCallback(
    async (goalId: string, filters?: { status?: string; prioridade?: string }) => {
      if (!token) {
        return;
      }

      setIsLoading(true);
      try {
        const response = await listTasks(token, parseInt(goalId), filters);
        
        if (!response.data || !Array.isArray(response.data)) {
          console.error('Resposta inválida do backend:', response);
          setTasks([]);
          return;
        }

        const convertedTasks = response.data.map(convertBackendTaskToFrontend);

        setTasks(convertedTasks);
      } catch (error) {
        console.error('TasksContext - Erro ao buscar tarefas:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const createTask = useCallback(
    async (goalId: string, data: CreateTaskRequest): Promise<void> => {
      if (!token) throw new Error('Usuário não autenticado');

      setIsLoading(true);
      try {
        await createTaskAPI(token, parseInt(goalId), data);

        // Recarrega as tarefas após criar
        await fetchTasks(goalId);
      } catch (error) {
        console.error('TasksContext - Erro ao criar tarefa:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token, fetchTasks]
  );

  const updateTask = useCallback(
    async (goalId: string, taskId: string, data: UpdateTaskRequest): Promise<Task> => {
      if (!token) throw new Error('Usuário não autenticado');

      setIsLoading(true);
      try {
        const response = await updateTaskAPI(token, parseInt(goalId), parseInt(taskId), data);
        const updatedTask = convertBackendTaskToFrontend(response.data);

        setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));

        return updatedTask;
      } catch (error) {
        console.error('TasksContext - Erro ao atualizar tarefa:', error);
        // Recarrega as tarefas em caso de erro para garantir consistência
        await fetchTasks(goalId);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token, fetchTasks]
  );

  const deleteTask = useCallback(
    async (goalId: string, taskId: string): Promise<void> => {
      if (!token) throw new Error('Usuário não autenticado');

      setIsLoading(true);
      try {
        await deleteTaskAPI(token, parseInt(goalId), parseInt(taskId));

        setTasks((prev) => prev.filter((t) => t.id !== taskId));
      } catch (error) {
        console.error('TasksContext - Erro ao deletar tarefa:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const concludeTask = useCallback(
    async (goalId: string, taskId: string): Promise<Task> => {
      if (!token) throw new Error('Usuário não autenticado');

      setIsLoading(true);
      try {
        const response = await concludeTaskAPI(token, parseInt(goalId), parseInt(taskId));
        const concludedTask = convertBackendTaskToFrontend(response.data);

        setTasks((prev) => prev.map((t) => (t.id === taskId ? concludedTask : t)));

        return concludedTask;
      } catch (error) {
        console.error('TasksContext - Erro ao concluir tarefa:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const refreshTasks = useCallback(
    async (goalId: string) => {
      await fetchTasks(goalId);
    },
    [fetchTasks]
  );

  return (
    <TasksContext.Provider
      value={{
        tasks,
        isLoading,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        concludeTask,
        refreshTasks,
      }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks deve ser usado dentro de um TasksProvider');
  }
  return context;
}
