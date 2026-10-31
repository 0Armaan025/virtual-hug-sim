"use client";
import { useState, useEffect, useRef, useCallback } from 'react';

interface Particle {
  id: number; x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number; color: string; type: 'heart' | 'confetti';
}
const COLORS = ['#d46a6a', '#f5d0a9', '#e8b898', '#c47a4a', '#b85c5c', '#ffe4c4', '#f8e8d0'];

export default function Particles({ active = false }: { active?: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animRef = useRef<number>(0);

  const spawn = useCallback((count: number) => {
    const cx = typeof window !== 'undefined' ? window.innerWidth / 2 : 400;
    const cy = typeof window !== 'undefined' ? window.innerHeight / 2 : 300;
    const next: Particle[] = [];
    for (let i = 0; i < count; i++) {
      next.push({
        id: Date.now() + i + Math.random(), x: cx + (Math.random()-0.5)*300,
        y: cy + (Math.random()-0.5)*300, vx: (Math.random()-0.5)*5, vy: (Math.random()-0.5)*5 - 2,
        life: 0, maxLife: 50 + Math.random()*50, size: 6 + Math.random()*14,
        color: COLORS[Math.floor(Math.random()*COLORS.length)],
        type: Math.random() > 0.4 ? 'heart' : 'confetti',
      });
    }
    setParticles(p => [...p, ...next]);
  }, []);

  useEffect(() => {
    if (!active) return;
    spawn(15);
    const int = setInterval(() => spawn(4), 600);
    return () => { clearInterval(int); };
  }, [active, spawn]);

  useEffect(() => {
    if (!particles.length) return;
    let running = true;
    const tick = () => {
      if (!running) return;
      setParticles(p =>
        p.map(pt => ({ ...pt, x: pt.x+pt.vx, y: pt.y+pt.vy, vy: pt.vy+0.08, life: pt.life+1 }))
          .filter(pt => pt.life < pt.maxLife && pt.y < (typeof window !== 'undefined' ? window.innerHeight + 50 : 700))
      );
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, [particles.length]);

  if (!particles.length) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: p.x, top: p.y, width: p.size, height: p.size,
          background: p.color, borderRadius: p.type === 'heart' ? '50% 50% 0 50%' : '3px',
          opacity: Math.max(0, 1 - p.life/p.maxLife),
          transform: `rotate(${p.life*8}deg) scale(${0.8 + 0.2*Math.sin(p.life*0.1)})`,
        }} />
      ))}
    </div>
  );
}
