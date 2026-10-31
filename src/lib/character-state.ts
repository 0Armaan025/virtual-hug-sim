import { Character } from '@/types';

export const DEFAULT_CHARACTER: Character = {
  id: 'player',
  name: 'You',
  hairColor: '#5a3d2b',
  hairStyle: 'short',
  skinColor: '#f0c8a0',
  outfitColor: '#8a6d4b',
  outfitType: 'sweater',
  accessory: 'none',
};

export const HAIR_COLORS = ['#5a3d2b', '#2a1a0f', '#8b4513', '#d4a76a', '#e8c39e'];
export const HAIR_STYLES = ['short', 'long', 'curly', 'spiky', 'bun'];
export const SKIN_COLORS = ['#f0c8a0', '#e8b898', '#dcc0b0', '#f5d0a9', '#ffe4c4'];
export const OUTFIT_COLORS = ['#8a6d4b', '#d46a6a', '#7a8b6a', '#6a5a8a', '#5a6a7a', '#c4a484'];
export const OUTFIT_TYPES = ['sweater', 'hoodie', 'tshirt', 'jacket', 'dress', 'cardigan'];
export const ACCESSORIES = ['none', 'glasses', 'hat', 'bow', 'flower', 'scarf', 'earrings'];
