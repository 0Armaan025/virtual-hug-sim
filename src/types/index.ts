export type Gender = 'female' | 'male' | 'nonbinary';

export interface Character {
  id: string;
  name: string;
  gender: Gender;
  hairColor: string;
  hairStyle: string;
  skinColor: string;
  outfitColor: string;
  outfitType: string;
  accessory: string;
}

export interface HugVariant {
  id: string;
  label: string;
  description: string;
}

export const HUG_VARIANTS: HugVariant[] = [
  { id: 'squeeze', label: 'Squeeze', description: 'A warm tight squeeze.' },
  { id: 'lean', label: 'Lean In', description: 'A soft, close lean-in hug.' },
  { id: 'spin', label: 'Spin', description: 'A joyful spin hug.' },
];

export interface HugEvent {
  fromId: string;
  toId: string;
  variant: string;
  message: string;
  timestamp: number;
}
