/**
 * Configuração dos avatares de heróis disponíveis no app
 */

export interface Avatar {
  id: string;
  image: any;
  name: string;
  unlocked: boolean;
  cost: number;
}

export const AVATARS: Avatar[] = [
  { 
    id: '1', 
    image: require('@/assets/imagens-heroes/arqueiro-verde.webp'), 
    name: 'Arqueiro Verde', 
    unlocked: true, 
    cost: 100 
  },
  { 
    id: '2', 
    image: require('@/assets/imagens-heroes/deadpool.webp'), 
    name: 'Deadpool', 
    unlocked: false, 
    cost: 200 
  },
  { 
    id: '3', 
    image: require('@/assets/imagens-heroes/invencivel.webp'), 
    name: 'Invencível', 
    unlocked: false, 
    cost: 200 
  },
  { 
    id: '4', 
    image: require('@/assets/imagens-heroes/flash.webp'), 
    name: 'Flash', 
    unlocked: true, 
    cost: 350 
  },
  { 
    id: '5', 
    image: require('@/assets/imagens-heroes/homem-aranha-venon.webp'), 
    name: 'Aranha Venom', 
    unlocked: false, 
    cost: 350 
  },
  { 
    id: '6', 
    image: require('@/assets/imagens-heroes/homem-aranha.webp'), 
    name: 'Homem-Aranha', 
    unlocked: true, 
    cost: 400 
  },
  { 
    id: '7', 
    image: require('@/assets/imagens-heroes/aranha-preto.webp'), 
    name: 'Aranha Preto', 
    unlocked: false, 
    cost: 400 
  },
  { 
    id: '8', 
    image: require('@/assets/imagens-heroes/kratos.webp'), 
    name: 'Kratos', 
    unlocked: false, 
    cost: 500 
  },
  { 
    id: '9', 
    image: require('@/assets/imagens-heroes/demolidor.webp'), 
    name: 'Demolidor', 
    unlocked: false, 
    cost: 1000 
  },
  { 
    id: '10', 
    image: require('@/assets/imagens-heroes/batman.webp'), 
    name: 'Batman', 
    unlocked: false, 
    cost: 1000 
  },
];

/**
 * Retorna o avatar com base no ID
 */
export function getAvatarById(id: string): Avatar | undefined {
  return AVATARS.find(avatar => avatar.id === id);
}

/**
 * Retorna a imagem do avatar com base no ID
 */
export function getAvatarImage(id: string): any | undefined {
  const avatar = getAvatarById(id);
  return avatar?.image;
}
