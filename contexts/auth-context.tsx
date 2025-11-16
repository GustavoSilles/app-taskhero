import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { registerUser, loginUser, decodeToken, updateProfile, listUserRecompensas, updateUserAvatar } from '@/services/api';
import { websocketService, WebSocketMessage } from '@/services/websocket';
import { useToast } from './toast-context';

interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateSelectedAvatar: (avatarId: string) => Promise<void>;
  updateUserProfile: (data: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => Promise<void>;
  isLoading: boolean;
  unlockedAvatars: string[]; // IDs dos avatares desbloqueados
  refreshUnlockedAvatars: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const TOKEN_KEY = '@taskhero:token';
const USER_KEY = '@taskhero:user';
const UNLOCKED_AVATARS_KEY = '@taskhero:unlocked_avatars';
const LOGIN_DATE_KEY = '@taskhero:login_date';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unlockedAvatars, setUnlockedAvatars] = useState<string[]>([]);
  const toast = useToast();

  // Carrega dados salvos ao iniciar
  useEffect(() => {
    loadStoredData();
  }, []);

  // Conecta/desconecta WebSocket baseado no estado de autenticação
  useEffect(() => {
    if (user?.id) {
      websocketService.connect(user.id);
      const unsubscribe = websocketService.subscribe(handleWebSocketMessage);

      return () => {
        unsubscribe();
        websocketService.disconnect();
      };
    }
  }, [user?.id]);

  const handleWebSocketMessage = (data: WebSocketMessage) => {
    // Se é uma notificação de meta expirada
    if (data.type === 'META_EXPIRADA') {
      toast.warning(
        '⏰ Meta Expirada',
        data.message || 'Uma de suas metas atingiu o prazo final'
      );
      return;
    }
    
    // Se é uma notificação de emblema desbloqueado
    if (data.type === 'EMBLEMA_DESBLOQUEADO') {
      const emblemaTitle = data.data?.title || data.titulo || 'Novo Emblema';
      const emblemaDescription = data.data?.description || data.message || '';
      
      toast.success(
        `🏆 Emblema Desbloqueado!`,
        `${emblemaTitle}${emblemaDescription ? ': ' + emblemaDescription : ''}`
      );
      return;
    }
    
    // Se é uma notificação de conquista (mantém compatibilidade)
    if (data.message && data.titulo) {
      toast.success('🎉 Nova Conquista!', data.titulo);
      return;
    }

    // Se são dados atualizados do usuário (coins, XP, nível)
    if (data.level !== undefined || data.xp_points !== undefined || data.task_coins !== undefined) {
      setUser(prevUser => {
        if (!prevUser) return null;

        const newLevel = data.level ?? prevUser.level;
        const totalXP = data.xp_points ?? prevUser.totalPoints;
        
        // Calcula XP necessário para o próximo nível (100 * nível)
        // Nível 1->2: 100, Nível 2->3: 200, Nível 3->4: 300, etc.
        const xpForNextLevel = 100 * newLevel;
        
        // Calcula quanto XP acumulado até o nível atual
        let xpAccumulatedUntilCurrentLevel = 0;
        for (let i = 1; i < newLevel; i++) {
          xpAccumulatedUntilCurrentLevel += 100 * i;
        }
        
        // XP dentro do nível atual (reseta a cada nível)
        const xpInCurrentLevel = totalXP - xpAccumulatedUntilCurrentLevel;

        const updatedUser: User = {
          ...prevUser,
          level: newLevel,
          currentXP: xpInCurrentLevel, // XP do nível atual (reseta)
          xpToNextLevel: xpForNextLevel, // XP necessário para próximo nível
          totalPoints: totalXP, // XP total acumulado
          taskCoins: data.task_coins ?? prevUser.taskCoins,
        };

        // Salva no AsyncStorage
        AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser)).catch(err => 
          console.error('Erro ao salvar usuário:', err)
        );

        return updatedUser;
      });
    }
  };

  const loadStoredData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      const storedUser = await AsyncStorage.getItem(USER_KEY);
      const storedUnlockedAvatars = await AsyncStorage.getItem(UNLOCKED_AVATARS_KEY);
      const loginDate = await AsyncStorage.getItem(LOGIN_DATE_KEY);

      if (storedToken && storedUser) {
        // Verifica se o token expirou (29 dias)
        if (loginDate) {
          const loginTime = new Date(loginDate).getTime();
          const currentTime = new Date().getTime();
          const daysPassed = (currentTime - loginTime) / (1000 * 60 * 60 * 24);

          // Se passou mais de 29 dias, faz logout automático
          if (daysPassed >= 29) {
            console.log('Token expirado após 29 dias. Fazendo logout automático.');
            await AsyncStorage.removeItem(TOKEN_KEY);
            await AsyncStorage.removeItem(USER_KEY);
            await AsyncStorage.removeItem(UNLOCKED_AVATARS_KEY);
            await AsyncStorage.removeItem(LOGIN_DATE_KEY);
            setIsLoading(false);
            return;
          }
        }

        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        if (storedUnlockedAvatars) {
          setUnlockedAvatars(JSON.parse(storedUnlockedAvatars));
        }

        // Tenta atualizar avatares desbloqueados do backend
        try {
          const response = await listUserRecompensas(storedToken);
          const avatarIds = response.data
            .filter((r: any) => r.tipo === 'AVATAR')
            .map((r: any) => r.image_id);
          
          setUnlockedAvatars(avatarIds);
          await AsyncStorage.setItem(UNLOCKED_AVATARS_KEY, JSON.stringify(avatarIds));
        } catch (error) {
          console.error('Erro ao carregar avatares do backend:', error);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados salvos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUnlockedAvatars = async () => {
    if (!token) return;
    
    try {
      const response = await listUserRecompensas(token);
      const avatarIds = response.data
        .filter((r: any) => r.tipo === 'AVATAR')
        .map((r: any) => r.image_id);
      
      setUnlockedAvatars(avatarIds);
      await AsyncStorage.setItem(UNLOCKED_AVATARS_KEY, JSON.stringify(avatarIds));
    } catch (error) {
      console.error('Erro ao atualizar avatares:', error);
      throw error;
    }
  };

  const buildUserFromBackendData = (backendData: any, userToken: string): User => {
    const tokenData = decodeToken(userToken);
    
    const currentLevel = tokenData.level || 1;
    const totalXP = tokenData.xp_points || 0;
    
    // Calcula XP necessário para o próximo nível (100 * nível)
    // Nível 1->2: 100, Nível 2->3: 200, Nível 3->4: 300, etc.
    const xpForNextLevel = 100 * currentLevel;
    
    // Calcula quanto XP acumulado até o nível atual
    let xpAccumulatedUntilCurrentLevel = 0;
    for (let i = 1; i < currentLevel; i++) {
      xpAccumulatedUntilCurrentLevel += 100 * i;
    }
    
    // XP dentro do nível atual (reseta a cada nível)
    const xpInCurrentLevel = totalXP - xpAccumulatedUntilCurrentLevel;

    return {
      id: tokenData.id.toString(),
      name: backendData.nome,
      email: backendData.email,
      createdAt: new Date(),
      level: currentLevel,
      currentXP: xpInCurrentLevel, // XP do nível atual (reseta)
      xpToNextLevel: xpForNextLevel, // XP necessário para próximo nível
      totalPoints: totalXP, // XP total acumulado
      taskCoins: tokenData.task_coins || 0,
      goalsCompletedOnTime: 0,
      goalsCompletedLate: 0,
      goalsExpired: 0,
      selectedAvatarId: tokenData.selected_avatar_id || null,
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

      // Salva no AsyncStorage com data de login
      const currentDate = new Date().toISOString();
      await AsyncStorage.setItem(TOKEN_KEY, response.data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
      await AsyncStorage.setItem(LOGIN_DATE_KEY, currentDate);

      // Carrega avatares desbloqueados
      try {
        const recompensasResponse = await listUserRecompensas(response.data.token);
        const avatarIds = recompensasResponse.data
          .filter((r: any) => r.tipo === 'AVATAR')
          .map((r: any) => r.image_id);
        
        setUnlockedAvatars(avatarIds);
        await AsyncStorage.setItem(UNLOCKED_AVATARS_KEY, JSON.stringify(avatarIds));
      } catch (error) {
        console.error('Erro ao carregar avatares:', error);
        // Não impede o login se falhar
      }

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

      // Salva no AsyncStorage com data de login
      const currentDate = new Date().toISOString();
      await AsyncStorage.setItem(TOKEN_KEY, loginResponse.data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
      await AsyncStorage.setItem(LOGIN_DATE_KEY, currentDate);

      // Carrega avatares desbloqueados do backend
      try {
        const recompensasResponse = await listUserRecompensas(loginResponse.data.token);
        const avatarIds = recompensasResponse.data
          .filter((r: any) => r.tipo === 'AVATAR')
          .map((r: any) => r.image_id);
        
        setUnlockedAvatars(avatarIds);
        await AsyncStorage.setItem(UNLOCKED_AVATARS_KEY, JSON.stringify(avatarIds));
      } catch (error) {
        console.error('Erro ao carregar avatares:', error);
        // Não impede o cadastro se falhar
      }

      console.log('AuthContext - Cadastro bem-sucedido:', userData.name);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    console.log('AuthContext - Fazendo logout');
    websocketService.disconnect();
    setUser(null);
    setToken(null);
    setUnlockedAvatars([]);
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    await AsyncStorage.removeItem(UNLOCKED_AVATARS_KEY);
    await AsyncStorage.removeItem(LOGIN_DATE_KEY);
  };

  const updateSelectedAvatar = async (avatarId: string) => {
    if (!user || !token) return;

    // ATUALIZAÇÃO OTIMISTA: Atualiza imediatamente no front-end
    const previousUser = user;
    const updatedUser = {
      ...user,
      selectedAvatarId: avatarId,
    };
    
    setUser(updatedUser);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    console.log('AuthContext - Avatar atualizado otimisticamente:', avatarId);

    // Depois faz a chamada ao backend em segundo plano
    try {
      const response = await updateUserAvatar(token, avatarId);
      
      // Atualiza com os dados do backend (pode ter mudanças no token)
      const newToken = response.data.token;
      const backendUser = buildUserFromBackendData(decodeToken(newToken), newToken);
      
      setToken(newToken);
      setUser(backendUser);

      // Persiste no AsyncStorage
      const currentDate = new Date().toISOString();
      await AsyncStorage.setItem(TOKEN_KEY, newToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(backendUser));
      await AsyncStorage.setItem(LOGIN_DATE_KEY, currentDate);

      console.log('AuthContext - Avatar confirmado no backend:', avatarId);
    } catch (error) {
      // Se der erro, reverte para o usuário anterior
      console.error('AuthContext - Erro ao atualizar avatar no backend, revertendo:', error);
      setUser(previousUser);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(previousUser));
      throw error;
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

      // Salva no AsyncStorage e atualiza a data de login (novo token = nova sessão)
      const currentDate = new Date().toISOString();
      await AsyncStorage.setItem(TOKEN_KEY, response.data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      await AsyncStorage.setItem(LOGIN_DATE_KEY, currentDate);

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
        unlockedAvatars,
        refreshUnlockedAvatars,
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
