import { Tabs } from 'expo-router';
import React from 'react';
import { View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemeSelector } from '@/components/theme-selector';
import { LevelCoinsHeader } from '@/components/level-coins-header';
import { Logo } from '@/components/logo';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { mockUser } from '@/mocks/user';

export default function TabLayout() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        // Tab Bar
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.icon,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        
        // Header
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.surface,
          height: Platform.OS === 'ios' ? 100 : 60 + insets.top,
        },
        headerTintColor: colors.text,
        headerTitleAlign: 'center',
        headerLeft: () => (
          <View style={{ marginLeft: 16 }}>
            <Logo variant="icon" size="small" />
          </View>
        ),
        headerTitle: () => (
          <LevelCoinsHeader
            level={mockUser.level}
            currentXP={mockUser.currentXP}
            xpToNextLevel={mockUser.xpToNextLevel}
            taskCoins={mockUser.taskCoins}
          />
        ),
        headerRight: () => <ThemeSelector style={{ marginRight: 16 }} />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Metas',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="target" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Recompensas',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="star.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="person.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'Sobre',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="info.circle" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
