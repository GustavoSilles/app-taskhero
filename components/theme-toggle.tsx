import React from 'react';
import { TouchableOpacity, StyleSheet, View, Animated } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useTheme } from '@/contexts/theme-context';
import { Colors } from '@/constants/theme';

interface ThemeToggleProps {
  style?: any;
}

export function ThemeToggle({ style }: ThemeToggleProps) {
  const { colorScheme, toggleTheme } = useTheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity
      style={[
        styles.toggleContainer,
        {
          backgroundColor: isDark ? colors.border : colors.surface,
          borderColor: colors.border,
        },
        style,
      ]}
      onPress={toggleTheme}
      activeOpacity={0.7}>
      <View style={[
        styles.toggleTrack,
        { backgroundColor: isDark ? '#374151' : '#E5E7EB' }
      ]}>
        <View style={[
          styles.toggleThumb,
          {
            backgroundColor: colors.surface,
            transform: [{ translateX: isDark ? 22 : 0 }],
          }
        ]}>
          <IconSymbol
            name={isDark ? 'moon.fill' : 'sun.max.fill'}
            size={14}
            color={isDark ? '#F59E0B' : '#F59E0B'}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggleContainer: {
    padding: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  toggleTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    position: 'relative',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});
