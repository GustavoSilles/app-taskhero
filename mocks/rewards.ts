/**
 * Mock data for reward shop items
 */

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'theme' | 'avatar' | 'boost' | 'special';
  image?: string;
  isPurchased?: boolean;
}

export const mockShopItems: ShopItem[] = [
  // Temas
  {
    id: 'theme-1',
    name: 'Tema Oceano',
    description: 'Interface com tons de azul e verde água',
    cost: 200,
    category: 'theme',
  },
  {
    id: 'theme-2',
    name: 'Tema Sunset',
    description: 'Cores quentes de pôr do sol',
    cost: 200,
    category: 'theme',
  },
  {
    id: 'theme-3',
    name: 'Tema Neon',
    description: 'Visual futurista com cores vibrantes',
    cost: 300,
    category: 'theme',
  },
  {
    id: 'theme-4',
    name: 'Tema Minimalista',
    description: 'Design clean e elegante',
    cost: 250,
    category: 'theme',
  },

  // Avatares
  {
    id: 'avatar-1',
    name: 'Avatar Ninja',
    description: 'Personagem ninja misterioso',
    cost: 150,
    category: 'avatar',
  },
  {
    id: 'avatar-2',
    name: 'Avatar Robô',
    description: 'Robô futurista high-tech',
    cost: 150,
    category: 'avatar',
  },
  {
    id: 'avatar-3',
    name: 'Avatar Espacial',
    description: 'Astronauta explorando o cosmos',
    cost: 180,
    category: 'avatar',
  },
  {
    id: 'avatar-4',
    name: 'Avatar Samurai',
    description: 'Guerreiro samurai honrado',
    cost: 200,
    category: 'avatar',
  },

  // Boosts
  {
    id: 'boost-1',
    name: 'Dobro de XP',
    description: '2x XP por 24 horas',
    cost: 100,
    category: 'boost',
  },
  {
    id: 'boost-2',
    name: 'Pontos Extra',
    description: '+50% pontos por 3 dias',
    cost: 150,
    category: 'boost',
  },
  {
    id: 'boost-3',
    name: 'Super Boost',
    description: '2x XP e pontos por 1 semana',
    cost: 400,
    category: 'boost',
  },

  // Especiais
  {
    id: 'special-1',
    name: 'Proteção de Streak',
    description: 'Mantém sua sequência por 1 dia perdido',
    cost: 120,
    category: 'special',
  },
  {
    id: 'special-2',
    name: 'Checkpoint',
    description: 'Salve seu progresso atual',
    cost: 80,
    category: 'special',
  },
  {
    id: 'special-3',
    name: 'Lupa Mágica',
    description: 'Revela dicas para completar metas',
    cost: 90,
    category: 'special',
  },
];

export const CATEGORY_LABELS: Record<ShopItem['category'], string> = {
  theme: 'Temas',
  avatar: 'Avatares',
  boost: 'Boosts',
  special: 'Especiais',
};

export const CATEGORY_EMOJIS: Record<ShopItem['category'], string> = {
  theme: '🎨',
  avatar: '👤',
  boost: '⚡',
  special: '✨',
};
