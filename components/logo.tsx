import React from 'react';
import { Image, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/theme-context';

interface LogoProps {
  variant?: 'full' | 'hero' | 'icon';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export function Logo({ variant = 'full', size = 'medium', style }: LogoProps) {
  const { colorScheme } = useTheme();

  // Dimensões baseadas no tamanho
  const dimensions = {
    small: { full: { width: 120, height: 32 }, icon: { width: 32, height: 32 } },
    medium: { full: { width: 180, height: 48 }, icon: { width: 48, height: 48 } },
    large: { full: { width: 240, height: 64 }, icon: { width: 64, height: 64 } },
  };

  const logoSize = dimensions[size];

  // Escolhe a logo baseada no tema (light ou dark) e na variante
  if (variant === 'icon') {
    return (
      <Image
        source={require('@/assets/images/logo-small.png')}
        style={[logoSize.icon, styles.image, style]}
        resizeMode="contain"
      />
    );
  }

  // Para 'full' e 'hero', usa a logo completa baseada no tema
  const logoSource = colorScheme === 'dark'
    ? require('@/assets/images/logo-dark.png')
    : require('@/assets/images/logo-light.png');

  return (
    <Image
      source={logoSource}
      style={[logoSize.full, styles.image, style]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    // Garante que a imagem seja renderizada corretamente
  },
});
