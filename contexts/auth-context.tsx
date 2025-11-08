import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { registerUser, loginUser, decodeToken, updateProfile } from '@/services/api';

interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateSelectedAvatar: (avatarId: string) => void;
  updateUserProfile: (data: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const TOKEN_KEY = '@taskhero:token';
const USER_KEY = '@taskhero:user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega dados salvos ao iniciar
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      const storedUser = await AsyncStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erro ao carregar dados salvos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buildUserFromBackendData = (backendData: any, userToken: string): User => {
    const tokenData = decodeToken(userToken);
    
    // Calcula XP para o próximo nível (assumindo 100 XP por nível)
    const xpPerLevel = 100;
    const currentLevel = tokenData.level || 1;
    const currentXP = tokenData.xp_points || 0;
    const xpToNextLevel = (currentLevel * xpPerLevel) - currentXP;

    return {
      id: tokenData.id.toString(),
      name: backendData.nome,
      email: backendData.email,
      createdAt: new Date(),
      level: currentLevel,
      currentXP: currentXP,
      xpToNextLevel: Math.max(0, xpToNextLevel),
      totalPoints: currentXP,
      taskCoins: tokenData.task_coins || 0,
      goalsCompletedOnTime: 0,
      goalsCompletedLate: 0,
      goalsExpired: 0,
      selectedAvatarId: '1',
    };
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext - signIn iniciado');
    setIsLoading(true);
    try {
      const response = await loginUser({ email, senha: password });
      const userData = buildUserFromBackendData(response.data, response.data.token);

      setToken(response.data.token);
      setUser(userData);

      // Salva no AsyncStorage
      await AsyncStorage.setItem(TOKEN_KEY, response.data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));

      console.log('AuthContext - Login bem-sucedido:', userData.name);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    console.log('AuthContext - signUp iniciado');
    setIsLoading(true);
    try {
      const response = await registerUser({ nome: name, email, senha: password });
      
      // Após registrar, faz login automático
      const loginResponse = await loginUser({ email, senha: password });
      const userData = buildUserFromBackendData(loginResponse.data, loginResponse.data.token);

      setToken(loginResponse.data.token);
      setUser(userData);

      // Salva no AsyncStorage
      await AsyncStorage.setItem(TOKEN_KEY, loginResponse.data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));

      console.log('AuthContext - Cadastro bem-sucedido:', userData.name);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    console.log('AuthContext - Fazendo logout');
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  };

  const updateSelectedAvatar = (avatarId: string) => {
    if (user) {
      // Atualiza localmente (apenas mock, sem backend)
      const updatedUser = {
        ...user,
        selectedAvatarId: avatarId,
      };
      setUser(updatedUser);
      console.log('AuthContext - Avatar atualizado (mock):', avatarId);
    }
  };

  const updateUserProfile = async (data: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => {
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    console.log('AuthContext - updateUserProfile iniciado');
    setIsLoading(true);
    
    try {
      const requestData: any = {};
      
      if (data.name) requestData.nome = data.name;
      if (data.email) requestData.email = data.email;
      if (data.currentPassword && data.newPassword) {
        requestData.currentPassword = data.currentPassword;
        requestData.newPassword = data.newPassword;
      }

      const response = await updateProfile(token, requestData);
      
      // Atualiza os dados do usuário e o token
      const updatedUser = buildUserFromBackendData(response.data, response.data.token);
      
      setToken(response.data.token);
      setUser(updatedUser);

      // Salva no AsyncStorage
      await AsyncStorage.setItem(TOKEN_KEY, response.data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

      console.log('AuthContext - Perfil atualizado com sucesso:', updatedUser.name);
    } catch (error) {
      console.error('AuthContext - Erro ao atualizar perfil:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        updateSelectedAvatar,
        updateUserProfile,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
