export interface HugTypeInfo {
  id: string;
  label: string;
  description: string;
  soundNote: string;
  durationMs: number;
  intensity: number;
}

export const HUG_TYPES: HugTypeInfo[] = [
  { id: 'bear-hug', label: 'Bear Hug', description: 'A warm, tight embrace full of affection.', soundNote: 'C', durationMs: 2000, intensity: 5 },
  { id: 'gentle-hug', label: 'Gentle Hug', description: 'Soft and calming, like a gentle breeze.', soundNote: 'E', durationMs: 2500, intensity: 2 },
  { id: 'warm-hug', label: 'Warm Hug', description: 'Radiating warmth like a cozy fireplace.', soundNote: 'G', durationMs: 3000, intensity: 4 },
  { id: 'friend-hug', label: 'Friend Hug', description: 'Quick and cheerful, full of joy.', soundNote: 'A', durationMs: 1800, intensity: 3 },
  { id: 'happy-hug', label: 'Happy Hug', description: 'Bouncing with pure happiness.', soundNote: 'C5', durationMs: 2200, intensity: 5 },
  { id: 'cozy-hug', label: 'Cozy Hug', description: 'Like being wrapped in a favorite blanket.', soundNote: 'D', durationMs: 3500, intensity: 3 },
  { id: 'surprise-hug', label: 'Surprise Hug', description: 'Unexpected and delightful!', soundNote: 'F', durationMs: 1500, intensity: 4 },
  { id: 'long-hug', label: 'Long Hug', description: 'A lasting embrace that says everything.', soundNote: 'B', durationMs: 5000, intensity: 2 },
];
