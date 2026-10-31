"use client";
import { useState, useEffect, useRef, useCallback } from 'react';

interface Particle {
  id: number; x: number; y: number; vx: number; vy: number;
  life: number; maxLife: number; size: number; color: string; type: 'heart' | 'spark';
}
const COLORS = ['#ff8fa3', '#e0537a', '#ffb9c9', '#c9a0ff', '#8a9aff', '#ffd9a0'];

export default function Particles({ active = false }: { active?: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animRef = useRef(0);

  const spawn = useCallback((count: number) => {
    const cx = typeof window !== 'undefined' ? window.innerWidth / 2 : 400;
    const cy = typeof window !== 'undefined' ? window.innerHeight / 2 : 300;
    const next: Particle[] = [];
    for (let i = 0; i < count; i++) {
      next.push({
        id: Date.now() + i + Math.random(), x: cx + (Math.random() - 0.5) * 320,
        y: cy + (Math.random() - 0.5) * 320, vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5 - 2,
        life: 0, maxLife: 55 + Math.random() * 55, size: 6 + Math.random() * 12,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        type: Math.random() > 0.35 ? 'heart' : 'spark',
      });
    }
    setParticles(p => [...p, ...next]);
  }, []);

  useEffect(() => {
    if (!active) return;
    spawn(16);
    const int = setInterval(() => spawn(4), 550);
    return () => clearInterval(int);
  }, [active, spawn]);

  useEffect(() => {
    if (!particles.length) return;
    let running = true;
    const tick = () => {
      if (!running) return;
      setParticles(p => p.map(pt => ({ ...pt, x: pt.x + pt.vx, y: pt.y + pt.vy, vy: pt.vy + 0.08, life: pt.life + 1 }))
        .filter(pt => pt.life < pt.maxLife && pt.y < (typeof window !== 'undefined' ? window.innerHeight + 50 : 800)));
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
          background: p.color,
          borderRadius: p.type === 'heart' ? '50% 50% 0 50%' : '3px',
          boxShadow: `0 0 ${p.size}px ${p.color}88`,
          opacity: Math.max(0, 1 - p.life / p.maxLife),
          transform: `rotate(${p.life * 9}deg) scale(${0.7 + 0.3 * Math.sin(p.life * 0.12)})`,
        }} />
      ))}
    </div>
  );
}
