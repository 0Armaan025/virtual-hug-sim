export function playHugSound(note: string, durationMs: number, intensity: number) {
  try {
    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    // Note to frequency mapping
    const noteMap: Record<string, number> = {
      'C': 261.63, 'D': 293.66, 'E': 329.63, 'F': 349.23,
      'G': 392.00, 'A': 440.00, 'B': 493.88, 'C5': 523.25,
    };

    oscillator.frequency.value = noteMap[note] || 440;
    oscillator.type = intensity > 3 ? 'triangle' : 'sine';

    gain.gain.setValueAtTime(intensity / 10, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + durationMs / 1000);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      ctx.close();
    }, durationMs);
  } catch (e) {
    console.log('Audio not available');
  }
}

export function playBackgroundMusic() {
  try {
    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.value = 220;
    osc.type = 'sine';
    gain.gain.value = 0.02;

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    // Return a stop function
    return () => {
      osc.stop();
      ctx.close();
    };
  } catch (e) {
    return () => {};
  }
}
