/**
 * Serviço de API para comunicação com o backend
 */

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

// ============================================
// TIPOS - AUTENTICAÇÃO
// ============================================

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface RegisterResponse {
  data: {
    token: string;
  };
}

export interface LoginResponse {
  data: {
    token: string;
    nome: string;
    email: string;
    level: number;
  };
}

export interface ErrorResponse {
  status: number;
  message: string;
}

export interface UpdateProfileRequest {
  nome?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface UpdateProfileResponse {
  data: {
    token: string;
    nome: string;
    email: string;
    level: number;
  };
  message: string;
}

// ============================================
// TIPOS - METAS
// ============================================

export interface CreateGoalRequest {
  titulo: string;
  descricao?: string;
  data_inicio: string; // ISO 8601
  data_fim: string; // ISO 8601
}

export interface UpdateGoalRequest {
  titulo?: string;
  descricao?: string;
  data_inicio?: string;
  data_fim?: string;
}

export interface GoalResponse {
  id: number;
  titulo: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDO' | 'CONCLUIDO_COM_ATRASO' | 'EXPIRADO';
  notificado_expiracao: boolean;
  usuario_id: number;
  createdAt: string;
  updatedAt: string;
  tarefas?: TaskResponse[];
}

export interface GoalsListResponse {
  data: {
    metas: GoalResponse[];
    page: number;
    totalPages: number;
    totalMetas: number;
    concluidas: number;
  };
}

// ============================================
// TIPOS - TAREFAS
// ============================================

export interface CreateTaskRequest {
  titulo: string;
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA';
}

export interface UpdateTaskRequest {
  titulo?: string;
  prioridade?: 'BAIXA' | 'MEDIA' | 'ALTA';
  status?: 'PENDENTE' | 'CONCLUIDO';
}

export interface TaskResponse {
  id: number;
  titulo: string;
  status: 'PENDENTE' | 'CONCLUIDO';
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA';
  meta_id: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// FUNÇÕES - AUTENTICAÇÃO
// ============================================

/**
 * Registra um novo usuário
 */
export async function registerUser(data: RegisterRequest): Promise<RegisterResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Erro ao registrar usuário');
  }

  return responseData;
}

/**
 * Faz login do usuário
 */
export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Erro ao fazer login');
  }

  return responseData;
}

/**
 * Decodifica o token JWT para extrair informações do usuário
 */
export function decodeToken(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
}

/**
 * Atualiza o perfil do usuário
 */
export async function updateProfile(
  token: string, 
  data: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Erro ao atualizar perfil');
    }

    return responseData;
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
}

// ============================================
// FUNÇÕES - METAS
// ============================================

/**
 * Lista todas as metas do usuário
 */
export async function listGoals(
  token: string, 
  page: number = 1, 
  status: string | null = null,
  sortField: string = 'createdAt',
  sortOrder: string = 'DESC'
): Promise<GoalsListResponse> {
  try {
    let url = `${API_URL}/meta/list?page=${page}`;
    
    if (status && status !== 'all') {
      // Mapear status do frontend para backend
      const statusMap: Record<string, string> = {
        'in_progress': 'PENDENTE',
        'completed': 'CONCLUIDO',
        'completed_late': 'CONCLUIDO_COM_ATRASO',
        'expired': 'EXPIRADO'
      };
      const backendStatus = statusMap[status] || status;
      url += `&status=${backendStatus}`;
    }
    
    url += `&sortField=${sortField}&sortOrder=${sortOrder}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Erro ao listar metas');
    }

    return responseData;
  } catch (error) {
    console.error('Erro ao listar metas:', error);
    throw error;
  }
}

/**
 * Busca uma meta específica por ID
 */
export async function getGoalById(token: string, metaId: number): Promise<{ data: GoalResponse }> {
  try {
    const response = await fetch(`${API_URL}/meta/${metaId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Erro ao buscar meta');
    }

    return responseData;
  } catch (error) {
    console.error('Erro ao buscar meta:', error);
    throw error;
  }
}

/**
 * Cria uma nova meta
 */
export async function createGoal(token: string, data: CreateGoalRequest): Promise<{ data: GoalResponse }> {
  try {
    const response = await fetch(`${API_URL}/meta/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Erro ao criar meta');
    }

    return responseData;
  } catch (error) {
    console.error('Erro ao criar meta:', error);
    throw error;
  }
}

/**
 * Atualiza uma meta existente
 */
export async function updateGoal(
  token: string,
  metaId: number,
  data: UpdateGoalRequest
): Promise<{ data: GoalResponse; message: string }> {
  try {
    const response = await fetch(`${API_URL}/meta/update/${metaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Erro ao atualizar meta');
    }

    return responseData;
  } catch (error) {
    console.error('Erro ao atualizar meta:', error);
    throw error;
  }
}

/**
 * Conclui uma meta
 */
export async function concludeGoal(
  token: string,
  metaId: number
): Promise<{ data: GoalResponse; message: string }> {
  try {
    const response = await fetch(`${API_URL}/meta/update/${metaId}/conclude`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Erro ao concluir meta');
    }

    return responseData;
  } catch (error) {
    console.error('Erro ao concluir meta:', error);
    throw error;
  }
}

/**
 * Deleta uma meta
 */
export async function deleteGoal(token: string, metaId: number): Promise<{ data: string }> {
  try {
    const response = await fetch(`${API_URL}/meta/delete/${metaId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Erro ao deletar meta');
    }

    return responseData;
  } catch (error) {
    console.error('Erro ao deletar meta:', error);
    throw error;
  }
}

// ============================================
// FUNÇÕES - TAREFAS
// ============================================

/**
 * Lista todas as tarefas de uma meta
 */
export async function listTasks(
  token: string,
  metaId: number,
  filters?: { status?: string; prioridade?: string }
): Promise<{ data: TaskResponse[]; message: string }> {
  try {
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append('status', filters.status);
    if (filters?.prioridade) queryParams.append('prioridade', filters.prioridade);

    const url = `${API_URL}/tarefa/${metaId}/list${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || 'Erro ao listar tarefas');
    }

    return responseData;
  } catch (error) {
    console.error('Erro ao listar tarefas:', error);
    throw error;
  }
}

/**
 * Cria uma nova tarefa
 */
export async function createTask(
  token: string,
  metaId: number,
  data: CreateTaskRequest
): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_URL}/tarefa/${metaId}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || 'Erro ao criar tarefa');
    }

    return responseData;
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    throw error;
  }
}

/**
 * Atualiza uma tarefa existente
 */
export async function updateTask(
  token: string,
  metaId: number,
  tarefaId: number,
  data: UpdateTaskRequest
): Promise<{ data: TaskResponse; message: string }> {
  try {
    const response = await fetch(`${API_URL}/tarefa/${metaId}/update/${tarefaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Erro ao atualizar tarefa');
    }

    return responseData;
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    throw error;
  }
}

/**
 * Conclui uma tarefa
 */
export async function concludeTask(
  token: string,
  metaId: number,
  tarefaId: number
): Promise<{ data: TaskResponse; message: string }> {
  try {
    const response = await fetch(`${API_URL}/tarefa/${metaId}/update/${tarefaId}/conclude`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || 'Erro ao concluir tarefa');
    }

    return responseData;
  } catch (error) {
    console.error('Erro ao concluir tarefa:', error);
    throw error;
  }
}

/**
 * Deleta uma tarefa
 */
export async function deleteTask(
  token: string,
  metaId: number,
  tarefaId: number
): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_URL}/tarefa/${metaId}/delete/${tarefaId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || 'Erro ao deletar tarefa');
    }

    return responseData;
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    throw error;
  }
}

// ============================================
// OUTRAS FUNÇÕES
// ============================================

/**
 * Atualiza o avatar selecionado do usuário
 */
export async function updateUserAvatar(token: string, avatarId: string): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/auth/avatar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ avatarId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao atualizar avatar');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar avatar:', error);
    throw error;
  }
}
