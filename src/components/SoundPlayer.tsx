"use client";
import { useState, useRef } from 'react';

export default function SoundPlayer() {
  const [muted, setMuted] = useState(false);
  const bgRef = useRef<AudioContext | null>(null);

  const play = (freq: number, dur: number, type: OscillatorType = 'sine') => {
    if (muted) return;
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.value = .12; g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + dur / 1000);
      o.connect(g); g.connect(ctx.destination);
      o.start(); setTimeout(() => { o.stop(); ctx.close(); }, dur);
    } catch { }
  };

  const toggleBg = () => {
    if (bgRef.current) { bgRef.current.close(); bgRef.current = null; return; }
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      bgRef.current = ctx;
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = 110; g.gain.value = .025;
      o.connect(g); g.connect(ctx.destination); o.start();
    } catch { }
  };

  return (
    <section style={{
      background: 'linear-gradient(165deg, rgba(255,255,255,.05), rgba(255,255,255,.02))',
      border: '1px solid rgba(255,255,255,.09)', borderRadius: 26,
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      boxShadow: '0 24px 60px rgba(0,0,0,.45)', padding: '1.25rem', maxWidth: 520,
      margin: '0 auto',
    }}>
      <h3 style={{ margin: 0, fontSize: '.85rem', fontWeight: 800, color: '#f5ebe6', letterSpacing: '.08em', textTransform: 'uppercase' }}>Cozy sounds</h3>
      <div style={{ margin: '.75rem 0', display: 'flex', gap: '.5rem' }}>
        {[340, 410, 490, 590, 710].map(f => (
          <button key={f} onClick={() => play(f, 600)} style={{
            width: 40, height: 40, borderRadius: 14, cursor: 'pointer',
            border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.05)',
            color: '#f5ebe6', transition: 'transform .12s',
          }} onMouseDown={e => e.currentTarget.style.transform = 'scale(.92)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
            {f >= 590 ? '🎵' : f >= 490 ? '🎶' : '♪'}
          </button>
        ))}
      </div>
      <button
        onClick={() => { setMuted(!muted); toggleBg(); }}
        style={{
          width: '100%', marginTop: '.5rem', padding: '.6rem 1rem', borderRadius: 14, cursor: 'pointer',
          border: 'none', background: 'linear-gradient(160deg,#e0537a,#c73a63)', color: '#fff',
          fontWeight: 800, fontSize: '.85rem', boxShadow: '0 6px 18px rgba(224,83,122,.4)',
        }}
      >
        {bgRef.current ? 'Stop ambience' : 'Start ambience'} &nbsp;·&nbsp; {muted ? 'Unmute' : 'Mute'}
      </button>
    </section>
  );
}
