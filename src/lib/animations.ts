export interface HugAnimationConfig {
  duration: number;
  keyframes: { [key: string]: string };
}

export const HUG_ANIMATIONS: { [key: string]: HugAnimationConfig } = {
  'bear-hug': {
    duration: 2000,
    keyframes: {
      '0%': 'transform: scale(1) translateX(0) rotate(0deg)',
      '30%': 'transform: scale(1.15) translateX(-10px) rotate(-2deg)',
      '60%': 'transform: scale(0.95) translateX(5px) rotate(2deg)',
      '100%': 'transform: scale(1) translateX(0) rotate(0deg)',
    },
  },
  'gentle-hug': {
    duration: 2500,
    keyframes: {
      '0%': 'transform: scale(1) translateY(0) rotate(0deg)',
      '40%': 'transform: scale(1.05) translateY(-15px) rotate(1deg)',
      '70%': 'transform: scale(1.02) translateY(-8px) rotate(-0.5deg)',
      '100%': 'transform: scale(1) translateY(0) rotate(0deg)',
    },
  },
  'warm-hug': {
    duration: 3000,
    keyframes: {
      '0%': 'transform: scale(1) translateX(0) rotate(0deg)',
      '25%': 'transform: scale(1.1) translateX(-8px) rotate(-1deg)',
      '50%': 'transform: scale(1.08) translateX(8px) rotate(1deg)',
      '75%': 'transform: scale(1.05) translateX(-4px) rotate(0deg)',
      '100%': 'transform: scale(1) translateX(0) rotate(0deg)',
    },
  },
  'friend-hug': {
    duration: 1800,
    keyframes: {
      '0%': 'transform: scale(1) translateX(0) rotate(0deg)',
      '50%': 'transform: scale(1.2) translateX(-15px) rotate(-3deg)',
      '100%': 'transform: scale(1) translateX(0) rotate(0deg)',
    },
  },
  'happy-hug': {
    duration: 2200,
    keyframes: {
      '0%': 'transform: scale(1) translateY(0) rotate(0deg)',
      '30%': 'transform: scale(1.15) translateY(-20px) rotate(2deg)',
      '60%': 'transform: scale(0.9) translateY(10px) rotate(-1deg)',
      '100%': 'transform: scale(1) translateY(0) rotate(0deg)',
    },
  },
  'cozy-hug': {
    duration: 3500,
    keyframes: {
      '0%': 'transform: scale(1) translateX(0) rotate(0deg)',
      '20%': 'transform: scale(1.05) translateX(-5px) rotate(-0.5deg)',
      '50%': 'transform: scale(1.08) translateX(5px) rotate(0.5deg)',
      '80%': 'transform: scale(1.03) translateX(-2px) rotate(0deg)',
      '100%': 'transform: scale(1) translateX(0) rotate(0deg)',
    },
  },
  'surprise-hug': {
    duration: 1500,
    keyframes: {
      '0%': 'transform: scale(1) translateX(0) rotate(0deg)',
      '20%': 'transform: scale(1.1) translateX(-5px) rotate(-1deg)',
      '50%': 'transform: scale(1.3) translateX(-10px) rotate(-2deg)',
      '80%': 'transform: scale(1.15) translateX(5px) rotate(1deg)',
      '100%': 'transform: scale(1) translateX(0) rotate(0deg)',
    },
  },
  'long-hug': {
    duration: 5000,
    keyframes: {
      '0%': 'transform: scale(1) translateX(0) rotate(0deg)',
      '15%': 'transform: scale(1.03) translateX(-3px) rotate(-0.3deg)',
      '40%': 'transform: scale(1.06) translateX(3px) rotate(0.3deg)',
      '65%': 'transform: scale(1.04) translateX(-2px) rotate(-0.2deg)',
      '85%': 'transform: scale(1.02) translateX(2px) rotate(0.2deg)',
      '100%': 'transform: scale(1) translateX(0) rotate(0deg)',
    },
  },
};
