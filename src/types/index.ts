export interface Character {
  id: string;
  name: string;
  hairColor: string;
  hairStyle: string;
  skinColor: string;
  outfitColor: string;
  outfitType: string;
  accessory: string;
}

export interface HugTypeDef {
  id: string;
  label: string;
  description: string;
  animationDuration: number;
  intensity: number;
}

export interface HugEvent {
  fromId: string;
  toId: string;
  hugType: string;
  message: string;
  timestamp: number;
}
