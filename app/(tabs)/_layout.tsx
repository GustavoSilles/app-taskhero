import { Tabs, router } from 'expo-router';
import React from 'react';
import { View, Platform, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { LevelCoinsHeader } from '@/components/level-coins-header';
import { Logo } from '@/components/logo';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { mockUser } from '@/mocks/user';
import { useAuth } from '@/contexts/auth-context';
import { getAvatarImage } from '@/constants/avatars';

export default function TabLayout() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const handleAvatarPress = () => {
    router.push('/(tabs)/profile');
  };

  // Obtém a imagem do avatar de herói selecionado
  const selectedAvatarId = user?.selectedAvatarId || mockUser.selectedAvatarId;
  const heroAvatarImage = selectedAvatarId ? getAvatarImage(selectedAvatarId) : null;

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
        headerRight: () => (
          <TouchableOpacity 
            onPress={handleAvatarPress} 
            style={styles.avatarContainer}
            activeOpacity={0.7}
          >
            {heroAvatarImage ? (
              <Image
                source={heroAvatarImage}
                style={styles.avatar}
              />
            ) : (user?.avatarUrl || mockUser.avatarUrl) ? (
              <Image
                source={{ uri: user?.avatarUrl || mockUser.avatarUrl }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.secondary }]}>
                <IconSymbol name="person.fill" size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ),
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

const styles = StyleSheet.create({
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
