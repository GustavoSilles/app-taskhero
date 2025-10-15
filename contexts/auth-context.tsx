import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types';
import { mockUser } from '@/mocks/user';

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    console.log('AuthContext - signIn iniciado');
    setIsLoading(true);
    try {
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Por enquanto, aceita qualquer email/senha e retorna o mockUser
      if (email && password) {
        const authenticatedUser: User = {
          ...mockUser,
          email: email,
        };
        console.log('AuthContext - Usuário autenticado:', authenticatedUser.name);
        setUser(authenticatedUser);
      } else {
        throw new Error('Email e senha são obrigatórios');
      }
    } catch (error) {
      console.error('AuthContext - Erro no signIn:', error);
      throw error;
    } finally {
      setIsLoading(false);
      console.log('AuthContext - signIn finalizado');
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      if (name && email && password) {
        const newUser: User = {
          id: Date.now().toString(),
          name: name,
          email: email,
          createdAt: new Date(),
          level: 1,
          currentXP: 0,
          xpToNextLevel: 100,
          totalPoints: 0,
          taskCoins: 0,
          goalsCompletedOnTime: 0,
          goalsCompletedLate: 0,
          goalsExpired: 0,
        };
        setUser(newUser);
      } else {
        throw new Error('Todos os campos são obrigatórios');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    console.log('AuthContext - Fazendo logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
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
