/**
 * Paleta de Cores TaskHero - Tema Laranja & Roxo
 * 🔶 Laranja: energia, ação, motivação
 * 💜 Roxo: criatividade, conquistas, identidade
 */

import { Platform } from 'react-native';

// Cores Primárias
const primaryOrangeLight = '#FF7A00';
const primaryOrangeDark = '#FF9E44';
const secondaryPurpleLight = '#7B2CBF';
const secondaryPurpleDark = '#9D4EDD';

export const Colors = {
  light: {
    // Cores principais
    primary: primaryOrangeLight,
    secondary: secondaryPurpleLight,
    
    // Textos
    text: '#1C1C1C',
    textSecondary: '#5A5A5A',
    
    // Backgrounds
    background: '#F9F9FB',
    surface: '#FFFFFF',
    
    // Interação
    tint: primaryOrangeLight,
    accent: '#FFD6A5',
    
    // Ícones e Tabs
    icon: '#5A5A5A',
    tabIconDefault: '#5A5A5A',
    tabIconSelected: primaryOrangeLight,
    
    // Estados
    success: '#4caf50',
    warning: '#ffaa00',
    error: '#ff4444',
    info: secondaryPurpleLight,
    
    // UI Elements
    border: '#E0E0E0',
    shadow: '#000000',
    disabled: '#B5B5B5',
  },
  dark: {
    // Cores principais
    primary: primaryOrangeDark,
    secondary: secondaryPurpleDark,
    
    // Textos
    text: '#EAEAEA',
    textSecondary: '#B5B5B5',
    
    // Backgrounds
    background: '#121212',
    surface: '#1E1E1E',
    
    // Interação
    tint: primaryOrangeDark,
    accent: '#3D1F5E',
    
    // Ícones e Tabs
    icon: '#B5B5B5',
    tabIconDefault: '#B5B5B5',
    tabIconSelected: primaryOrangeDark,
    
    // Estados
    success: '#4caf50',
    warning: '#ffaa00',
    error: '#ff4444',
    info: secondaryPurpleDark,
    
    // UI Elements
    border: '#2A2A2A',
    shadow: '#000000',
    disabled: '#5A5A5A',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
