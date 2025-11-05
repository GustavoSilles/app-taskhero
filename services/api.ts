/**
 * Serviço de API para comunicação com o backend
 */

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

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

/**
 * Outras funções da API podem ser adicionadas aqui
 */
