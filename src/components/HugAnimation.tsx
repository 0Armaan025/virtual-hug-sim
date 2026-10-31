"use client";
import { useState, useEffect } from 'react';
import { HUG_ANIMATIONS } from '@/lib/animations';

export default function HugAnimation({ hugType = 'bear-hug', active = true }: { hugType?: string; active?: boolean }) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (active) {
      setAnimating(true);
      const timer = setTimeout(() => setAnimating(false), (HUG_ANIMATIONS[hugType]?.duration || 2000));
      return () => clearTimeout(timer);
    }
  }, [active, hugType]);

  const config = HUG_ANIMATIONS[hugType] || HUG_ANIMATIONS['bear-hug'];
  const keyframesName = `hug-anim-${hugType.replace(/[^a-zA-Z0-9]/g, '-')}`;
  const keyframeCSS = Object.entries(config.keyframes).map(([pct, val]) => `${pct} { ${val} }`).join(' ');

  const Char = ({ flip = false }: { flip?: boolean }) => (
    <div style={{ width: 120, height: 170, position: 'relative' }}>
      <div style={{
        width: 120, height: 140,
        background: 'linear-gradient(160deg, #fce0c5 0%, #f5d0a9 60%, #f0c8a0 100%)',
        borderRadius: '60px 60px 28px 28px', border: '3px solid #d46a6a',
        boxShadow: '0 10px 25px rgba(212,106,106,0.2)', position: 'relative', overflow: 'hidden',
        transform: flip ? 'scaleX(-1)' : 'none',
      }}>
        {/* Hair */}
        <div style={{ position: 'absolute', top: -12, left: 10, right: 10, height: 50, background: '#7a5c3a', borderRadius: '40px 40px 12px 12px', opacity: 0.85 }} />
        {/* Eyes */}
        <div style={{ position: 'absolute', top: 48, left: 28, width: 11, height: 11, background: '#5a3d2b', borderRadius: '50%', boxShadow: flip ? '-22px 0 0 #5a3d2b' : '22px 0 0 #5a3d2b' }} />
        {/* Smile */}
        <div style={{ position: 'absolute', top: 78, left: 32, width: 56, height: 16, borderBottom: '3px solid #c47a4a', borderRadius: '0 0 50px 50px' }} />
        {/* Outfit */}
        <div style={{ position: 'absolute', bottom: 5, left: 10, right: 10, height: 60, background: '#c47a4a', borderRadius: '18px 18px 0 0', borderTop: '2px solid #b85c5c' }} />
        {/* Flower accessory */}
        <div style={{ position: 'absolute', top: 8, right: 12, width: 22, height: 22, background: '#d46a6a', borderRadius: '50% 50% 0 50%', opacity: 0.8, animation: animating ? 'float 1.5s ease-in-out infinite' : 'none' }} />
      </div>
    </div>
  );

  return (
    <div style={{ position: 'relative', width: '100%', height: '340px', overflow: 'hidden', background: 'transparent' }}>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes ${keyframesName} { ${keyframeCSS} }` }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', animation: animating ? `${keyframesName} ${config.duration}ms ease-in-out` : 'none' }}>
        <div style={{ display: 'flex', gap: '-14px', alignItems: 'center' }}>
          <Char />
          <Char flip />
        </div>
      </div>
    </div>
  );
}
