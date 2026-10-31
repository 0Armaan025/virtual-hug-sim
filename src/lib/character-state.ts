import { Character, Gender } from '@/types';

export const DEFAULT_CHARACTER: Character = {
  id: 'player',
  name: 'You',
  gender: 'female',
  hairColor: '#4a2c2a',
  hairStyle: 'long',
  skinColor: '#f2c9a8',
  outfitColor: '#e0537a',
  outfitType: 'dress',
  accessory: 'none',
};

export const HAIR_COLORS = [
  '#2a1d18', '#4a2c2a', '#8a4a2a', '#c98d4b', '#e8c39e',
  '#b5934f', '#7a4b8a', '#3a4a8a', '#a02a4a', '#d8d3cc',
];

export const HAIR_STYLES: Record<Gender, string[]> = {
  female: ['long', 'ponytail', 'bun', 'short', 'curly', 'braids'],
  male: ['short', 'spiky', 'curly', 'buzz', 'manbun'],
  nonbinary: ['short', 'long', 'curly', 'bun', 'braids', 'buzz'],
};

export const SKIN_COLORS = [
  '#f7dcc0', '#f2c9a8', '#e0ac7e', '#c68863', '#a06b47',
  '#75502f', '#4c3520', '#f9e0cd', '#dba87a',
];

export const OUTFIT_COLORS = [
  '#e0537a', '#d94f6a', '#5a7ae0', '#3aa88a', '#8a5ae0',
  '#e08a3a', '#2a2a35', '#f0ebE3', '#c94f8a', '#3a5a8a',
];

export const OUTFIT_TYPES_BY_GENDER: Record<Gender, string[]> = {
  female: ['dress', 'top', 'sweater', 'hoodie', 'jacket'],
  male: ['tee', 'sweater', 'hoodie', 'jacket', 'suit'],
  nonbinary: ['tee', 'sweater', 'hoodie', 'jacket', 'suit', 'dress', 'top'],
};

export const ACCESSORIES = [
  'none', 'glasses', 'sunglasses', 'hat', 'beanie',
  'headphones', 'bow', 'flower', 'scarf', 'earrings', 'mask',
];

export const EYE_COLORS = ['#3a2a1f', '#2a4a6a', '#3a6a3a', '#6a3a3a', '#5a4a8a'];
