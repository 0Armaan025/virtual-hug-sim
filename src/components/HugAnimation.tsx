"use client";
import { useState, useEffect } from 'react';
import { HUG_ANIMATIONS } from '@/lib/animations';

export default function HugAnimation({ hugType = 'bear-hug', active = true }: { hugType?: string; active?: boolean }) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (active) { setAnimating(true); const timer = setTimeout(() => setAnimating(false), (HUG_ANIMATIONS[hugType]?.duration || 2000)); return () => clearTimeout(timer); }
  }, [active, hugType]);

  const config = HUG_ANIMATIONS[hugType] || HUG_ANIMATIONS['bear-hug'];
  const keyframesName = `hug-anim-${hugType.replace(/[^a-zA-Z0-9]/g, '-')}`;
  const keyframeCSS = Object.entries(config.keyframes).map(([pct, val]) => `${pct} { ${val} }`).join(' ');

  const Char = ({ flip = false }: { flip?: boolean }) => (
    <div style={{ width: 110, height: 160, position: 'relative' }}>
      <div style={{
        width: 110, height: 130,
        background: 'linear-gradient(160deg, #fce0c5 0%, #f5d0a9 60%, #f0c8a0 100%)',
        borderRadius: '55px 55px 25px 25px', border: '3px solid #d46a6a',
        boxShadow: '0 8px 20px rgba(212,106,106,0.2)', position: 'relative', overflow: 'hidden',
        transform: flip ? 'scaleX(-1)' : 'none',
      }}>
        <div style={{ position: 'absolute', top: -8, left: 8, right: 8, height: 45, background: '#7a5c3a', borderRadius: '35px 35px 10px 10px', opacity: 0.85 }} />
        <div style={{ position: 'absolute', top: 45, left: 25, width: 10, height: 10, background: '#5a3d2b', borderRadius: '50%', boxShadow: flip ? '-20px 0 0 #5a3d2b' : '20px 0 0 #5a3d2b' }} />
        <div style={{ position: 'absolute', top: 75, left: 30, width: 50, height: 15, borderBottom: '3px solid #c47a4a', borderRadius: '0 0 40px 40px' }} />
        <div style={{ position: 'absolute', bottom: 5, left: 8, right: 8, height: 55, background: '#c47a4a', borderRadius: '15px 15px 0 0', borderTop: '2px solid #b85c5c' }} />
      </div>
    </div>
  );

  return (
    <div style={{ position: 'relative', width: '100%', height: '320px', overflow: 'hidden', background: 'transparent' }}>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes ${keyframesName} { ${keyframeCSS} }` }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', animation: animating ? `${keyframesName} ${config.duration}ms ease-in-out` : 'none' }}>
        <div style={{ display: 'flex', gap: '-10px', alignItems: 'center' }}>
          <Char />
          <Char flip />
        </div>
      </div>
    </div>
  );
}
