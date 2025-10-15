import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ColorSchemeName, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextData {
  theme: Theme;
  colorScheme: ColorSchemeName;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

const THEME_STORAGE_KEY = '@TaskHero:theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  // Carrega o tema salvo
  useEffect(() => {
    loadTheme();
  }, []);

  // Listener para mudanças no tema do sistema
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
        setThemeState(savedTheme as Theme);
      }
    } catch (error) {
      console.log('Erro ao carregar tema:', error);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.log('Erro ao salvar tema:', error);
    }
  };

  const toggleTheme = () => {
    const currentScheme = theme === 'system' ? systemColorScheme : theme;
    const newTheme = currentScheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Determina o esquema de cores atual
  const getColorScheme = (): ColorSchemeName => {
    if (theme === 'system') {
      return systemColorScheme;
    }
    return theme;
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorScheme: getColorScheme(),
        setTheme,
        toggleTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
}
