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
    image: require('@/assets/imagens-heroes/homem-aranha.jpg'), 
    name: 'Homem-Aranha', 
    unlocked: true, 
    cost: 0 
  },
  { 
    id: '2', 
    image: require('@/assets/imagens-heroes/flash.jpg'), 
    name: 'Flash', 
    unlocked: true, 
    cost: 0 
  },
  { 
    id: '3', 
    image: require('@/assets/imagens-heroes/arqueiro-verde.jpg'), 
    name: 'Arqueiro Verde', 
    unlocked: true, 
    cost: 0 
  },
  { 
    id: '4', 
    image: require('@/assets/imagens-heroes/deadpool.jpg'), 
    name: 'Deadpool', 
    unlocked: false, 
    cost: 50 
  },
  { 
    id: '5', 
    image: require('@/assets/imagens-heroes/demolidor.jpg'), 
    name: 'Demolidor', 
    unlocked: false, 
    cost: 100 
  },
  { 
    id: '6', 
    image: require('@/assets/imagens-heroes/invencivel.jpg'), 
    name: 'Invencível', 
    unlocked: false, 
    cost: 150 
  },
  { 
    id: '7', 
    image: require('@/assets/imagens-heroes/homem-aranho-preto.jpg'), 
    name: 'Aranha Preto', 
    unlocked: false, 
    cost: 200 
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
