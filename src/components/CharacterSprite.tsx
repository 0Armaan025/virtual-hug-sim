"use client";
import { Character } from '@/types';

export default function CharacterSprite({
  character, walking = false, flip = false, scale = 1,
}: { character: Character; walking?: boolean; flip?: boolean; scale?: number }) {
  const { gender, hairColor, hairStyle, skinColor, outfitColor, outfitType, accessory } = character;
  const fem = gender === 'female';
  const masc = gender === 'male';

  const shadow = 'drop-shadow(0 8px 10px rgba(0,0,0,0.35))';

  return (
    <div style={{
      position: 'relative', width: 110 * scale, height: 168 * scale,
      transform: flip ? 'scaleX(-1)' : undefined, filter: shadow,
      transition: 'filter .3s',
    }}>
      <style>{`
        @keyframes blink { 0%,94%,100% { transform: scaleY(1); } 96% { transform: scaleY(0.1); } }
        @keyframes sway { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(2.5deg); } }
      `}</style>

      {/* back hair */}
      {(hairStyle === 'long' || hairStyle === 'braids') && (
        <div style={{
          position: 'absolute', top: 42 * scale, left: 2 * scale, width: 106 * scale, height: 92 * scale,
          background: `linear-gradient(180deg, ${hairColor}, ${shade(hairColor, -18)})`,
          borderRadius: '46px 46px 26px 26px', zIndex: 0,
        }} />
      )}
      {hairStyle === 'braids' && (
        <>
          <div style={{ position: 'absolute', top: 74 * scale, left: 6 * scale, width: 13 * scale, height: 62 * scale, background: shade(hairColor, -10), borderRadius: '0 0 8px 8px', zIndex: 0 }} />
          <div style={{ position: 'absolute', top: 74 * scale, right: 6 * scale, width: 13 * scale, height: 62 * scale, background: shade(hairColor, -10), borderRadius: '0 0 8px 8px', zIndex: 0 }} />
        </>
      )}

      {/* legs */}
      <div style={{
        position: 'absolute', bottom: -6 * scale, left: 38 * scale, width: 15 * scale, height: 30 * scale,
        background: '#3a3230', borderRadius: '3px 3px 9px 9px', zIndex: 0,
        transform: walking ? 'translateY(-3px) rotate(4deg)' : 'rotate(0deg)',
        transformOrigin: 'top center', transition: 'transform .18s ease-out',
      }} />
      <div style={{
        position: 'absolute', bottom: -6 * scale, right: 38 * scale, width: 15 * scale, height: 30 * scale,
        background: '#3a3230', borderRadius: '3px 3px 9px 9px', zIndex: 0,
        transform: walking ? 'translateY(-3px) rotate(-4deg)' : 'rotate(0deg)',
        transformOrigin: 'top center', transition: 'transform .18s ease-out',
      }} />

      {/* shoes */}
      <div style={{ position: 'absolute', bottom: -8 * scale, left: 32 * scale, width: 24 * scale, height: 12 * scale, background: '#241f1d', borderRadius: '7px 7px 4px 4px', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: -8 * scale, right: 32 * scale, width: 24 * scale, height: 12 * scale, background: '#241f1d', borderRadius: '7px 7px 4px 4px', zIndex: 0 }} />

      {/* arms */}
      <div style={{
        position: 'absolute', bottom: 34 * scale, left: 2 * scale, width: 18 * scale, height: 58 * scale,
        background: `linear-gradient(180deg, ${outfitColor}, ${shade(outfitColor, -14)})`,
        borderRadius: 10, zIndex: 1, border: '1px solid rgba(0,0,0,0.12)',
        transformOrigin: 'top center',
        transform: walking ? 'rotate(-24deg)' : 'rotate(-6deg)',
        transition: 'transform .18s ease-out',
      }}>
        <div style={{ position: 'absolute', bottom: -8 * scale, left: 2 * scale, width: 14 * scale, height: 14 * scale, background: skinColor, borderRadius: '50%' }} />
      </div>
      <div style={{
        position: 'absolute', bottom: 34 * scale, right: 2 * scale, width: 18 * scale, height: 58 * scale,
        background: `linear-gradient(180deg, ${outfitColor}, ${shade(outfitColor, -14)})`,
        borderRadius: 10, zIndex: 1, border: '1px solid rgba(0,0,0,0.12)',
        transformOrigin: 'top center',
        transform: walking ? 'rotate(24deg)' : 'rotate(6deg)',
        transition: 'transform .18s ease-out',
      }}>
        <div style={{ position: 'absolute', bottom: -8 * scale, left: 2 * scale, width: 14 * scale, height: 14 * scale, background: skinColor, borderRadius: '50%' }} />
      </div>

      {/* torso */}
      <div style={{
        position: 'absolute', bottom: 0, left: 14 * scale, width: 82 * scale, height: 74 * scale,
        background: `linear-gradient(160deg, ${shade(outfitColor, 12)}, ${outfitColor} 45%, ${shade(outfitColor, -16)})`,
        borderRadius: isTopLike(outfitType) ? '34px 34px 12px 12px' : '24px 24px 10px 10px',
        zIndex: 2, border: '1px solid rgba(0,0,0,0.14)',
        boxShadow: 'inset 0 -12px 22px rgba(0,0,0,0.14), inset 0 6px 12px rgba(255,255,255,0.16)',
        animation: walking ? undefined : 'sway 3.5s ease-in-out infinite',
      }}>
        {/* collar / neckline */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 30 * scale, height: 11 * scale,
          background: shade(skinColor, -12), borderRadius: '0 0 12px 12px', opacity: 0.9,
        }} />
        {/* outfit details */}
        {outfitType === 'suit' && (
          <>
            <div style={{ position: 'absolute', top: 8 * scale, left: 34 * scale, width: 5 * scale, bottom: 0, background: 'rgba(255,255,255,0.6)' }} />
            <div style={{ position: 'absolute', top: 16 * scale, left: 20 * scale, width: 14 * scale, height: 20 * scale, background: 'rgba(0,0,0,0.14)', borderRadius: 3 }} />
            <div style={{ position: 'absolute', top: 16 * scale, right: 20 * scale, width: 14 * scale, height: 20 * scale, background: 'rgba(0,0,0,0.14)', borderRadius: 3 }} />
            <div style={{ position: 'absolute', top: 6 * scale, left: 26 * scale, width: 0, height: 0, borderLeft: `${8 * scale}px solid transparent`, borderRight: `${8 * scale}px solid transparent`, borderTop: `${12 * scale}px solid rgba(255,255,255,0.75)` }} />
          </>
        )}
        {outfitType === 'dress' && (
          <div style={{ position: 'absolute', bottom: 0, left: -6 * scale, right: -6 * scale, height: 22 * scale, background: `linear-gradient(180deg, ${shade(outfitColor, -8)}, ${shade(outfitColor, -24)})`, borderRadius: '10px 10px 8px 8px' }} />
        )}
        {outfitType === 'jacket' && (
          <>
            <div style={{ position: 'absolute', inset: 0, left: 30 * scale, width: 5 * scale, background: 'rgba(0,0,0,0.16)' }} />
            <div style={{ position: 'absolute', top: 10 * scale, left: 20 * scale, width: 12 * scale, height: 16 * scale, background: 'rgba(255,255,255,0.2)', borderRadius: 3 }} />
            <div style={{ position: 'absolute', top: 10 * scale, right: 20 * scale, width: 12 * scale, height: 16 * scale, background: 'rgba(255,255,255,0.2)', borderRadius: 3 }} />
          </>
        )}
        {outfitType === 'hoodie' && (
          <div style={{ position: 'absolute', top: -6 * scale, left: '50%', transform: 'translateX(-50%)', width: 40 * scale, height: 20 * scale, background: shade(outfitColor, 6), borderRadius: `${14 * scale}px ${14 * scale}px 0 0`, border: '1px solid rgba(0,0,0,0.12)' }} />
        )}
        {(outfitType === 'sweater' || outfitType === 'top') && (
          <div style={{ position: 'absolute', top: 4 * scale, left: '50%', transform: 'translateX(-50%)', width: 50 * scale, height: 8 * scale, background: 'rgba(255,255,255,0.22)', borderRadius: 4 }} />
        )}
      </div>

      {/* head */}
      <div style={{
        position: 'absolute', top: 26 * scale, left: 12 * scale, width: 86 * scale, height: 84 * scale,
        background: `radial-gradient(circle at 34% 30%, ${shade(skinColor, 14)}, ${skinColor} 62%, ${shade(skinColor, -12)})`,
        borderRadius: '50%', zIndex: 3, border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: 'inset -6px -8px 16px rgba(0,0,0,0.10)',
      }}>
        {/* ears */}
        <div style={{ position: 'absolute', top: 38 * scale, left: -4 * scale, width: 10 * scale, height: 16 * scale, background: shade(skinColor, -6), borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: 38 * scale, right: -4 * scale, width: 10 * scale, height: 16 * scale, background: shade(skinColor, -6), borderRadius: '50%' }} />

        {/* blush */}
        <div style={{ position: 'absolute', top: 50 * scale, left: 9 * scale, width: 13 * scale, height: 7 * scale, background: 'rgba(224,83,122,0.30)', borderRadius: '50%', filter: 'blur(1px)' }} />
        <div style={{ position: 'absolute', top: 50 * scale, right: 9 * scale, width: 13 * scale, height: 7 * scale, background: 'rgba(224,83,122,0.30)', borderRadius: '50%', filter: 'blur(1px)' }} />

        {/* brows */}
        <div style={{ position: 'absolute', top: 32 * scale, left: 19 * scale, width: 15 * scale, height: 3 * scale, background: shade(hairColor, -10), borderRadius: 2, transform: masc ? 'rotate(-2deg)' : 'rotate(-6deg)' }} />
        <div style={{ position: 'absolute', top: 32 * scale, right: 19 * scale, width: 15 * scale, height: 3 * scale, background: shade(hairColor, -10), borderRadius: 2, transform: masc ? 'rotate(2deg)' : 'rotate(6deg)' }} />

        {/* eyes */}
        <div style={{
          position: 'absolute', top: 38 * scale, left: 18 * scale, width: 13 * scale, height: fem ? 16 * scale : 12 * scale,
          background: '#fff', borderRadius: '50%', overflow: 'hidden',
          animation: 'blink 4.2s infinite',
        }}>
          <div style={{ position: 'absolute', top: 4 * scale, left: 3 * scale, width: 7 * scale, height: 7 * scale, background: '#2e2a33', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 2 * scale, left: 4 * scale, width: 2.5 * scale, height: 2.5 * scale, background: '#fff', borderRadius: '50%' }} />
        </div>
        <div style={{
          position: 'absolute', top: 38 * scale, right: 18 * scale, width: 13 * scale, height: fem ? 16 * scale : 12 * scale,
          background: '#fff', borderRadius: '50%', overflow: 'hidden',
          animation: 'blink 4.2s infinite',
        }}>
          <div style={{ position: 'absolute', top: 4 * scale, left: 3 * scale, width: 7 * scale, height: 7 * scale, background: '#2e2a33', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 2 * scale, left: 4 * scale, width: 2.5 * scale, height: 2.5 * scale, background: '#fff', borderRadius: '50%' }} />
        </div>

        {/* lashes */}
        {fem && (
          <>
            <div style={{ position: 'absolute', top: 36 * scale, left: 15 * scale, width: 19 * scale, height: 3 * scale, background: '#2e2a33', borderRadius: 2, transform: 'rotate(-8deg)' }} />
            <div style={{ position: 'absolute', top: 36 * scale, right: 15 * scale, width: 19 * scale, height: 3 * scale, background: '#2e2a33', borderRadius: 2, transform: 'rotate(8deg)' }} />
          </>
        )}

        {/* nose + mouth */}
        <div style={{ position: 'absolute', top: 56 * scale, left: '50%', transform: 'translateX(-50%)', width: 4 * scale, height: 3 * scale, background: shade(skinColor, -22), borderRadius: '50%' }} />
        <div style={{
          position: 'absolute', top: 61 * scale, left: '50%', transform: 'translateX(-50%)',
          width: 16 * scale, height: 9 * scale,
          border: `2px solid ${shade(skinColor, -35)}`, borderTop: 'none',
          borderRadius: '0 0 14px 14px', borderColor: `${shade(skinColor, -38)} transparent transparent transparent`,
        }} />
      </div>

      {/* hair front */}
      <div style={{
        position: 'absolute', top: 14 * scale, left: 8 * scale, width: 94 * scale, height: 46 * scale,
        background: `linear-gradient(180deg, ${shade(hairColor, 16)}, ${hairColor} 60%, ${shade(hairColor, -6)})`,
        zIndex: 4,
        borderRadius: hairStyle === 'buzz' ? '44px 44px 18px 18px' : '46px 46px 16px 16px',
        boxShadow: 'inset 0 4px 10px rgba(255,255,255,0.18)',
      }}>
        {/* shine */}
        <div style={{ position: 'absolute', top: 6 * scale, left: 16 * scale, width: 30 * scale, height: 8 * scale, background: 'rgba(255,255,255,0.28)', borderRadius: 6, filter: 'blur(2px)' }} />
      </div>

      {/* bangs */}
      {hairStyle !== 'buzz' && (
        <div style={{
          position: 'absolute', top: 30 * scale, left: 12 * scale, width: 86 * scale, height: 24 * scale,
          background: `linear-gradient(180deg, ${hairColor}, ${shade(hairColor, -8)})`,
          borderRadius: '0 0 44px 44px', zIndex: 4,
        }} />
      )}

      {/* style specifics */}
      {hairStyle === 'spiky' && (
        <div style={{ position: 'absolute', top: -2 * scale, left: 26 * scale, zIndex: 4, display: 'flex', gap: 2 }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{
              width: 9 * scale, height: (16 + (i % 2) * 7) * scale, background: shade(hairColor, 8),
              clipPath: 'polygon(50% 0, 100% 100%, 0 100%)',
            }} />
          ))}
        </div>
      )}
      {hairStyle === 'ponytail' && (
        <div style={{
          position: 'absolute', top: 40 * scale, right: -14 * scale, width: 26 * scale, height: 78 * scale,
          background: `linear-gradient(180deg, ${hairColor}, ${shade(hairColor, -16)})`,
          borderRadius: '16px 16px 12px 20px', zIndex: 0, transformOrigin: 'top center',
          transform: walking ? 'rotate(14deg)' : 'rotate(4deg)', transition: 'transform .18s ease-out',
        }} />
      )}
      {hairStyle === 'manbun' && (
        <div style={{
          position: 'absolute', top: -10 * scale, left: '50%', transform: 'translateX(-50%)',
          width: 26 * scale, height: 26 * scale, background: shade(hairColor, -4),
          borderRadius: '50%', zIndex: 3,
        }} />
      )}
      {hairStyle === 'bun' && (
        <div style={{
          position: 'absolute', top: 4 * scale, left: '50%', transform: 'translateX(-50%)',
          width: 30 * scale, height: 30 * scale,
          background: `radial-gradient(circle at 35% 30%, ${shade(hairColor, 18)}, ${hairColor})`,
          borderRadius: '50%', zIndex: 2,
        }} />
      )}
      {hairStyle === 'curly' && (
        <>
          <div style={{ position: 'absolute', top: 4 * scale, left: 2 * scale, width: 22 * scale, height: 22 * scale, background: shade(hairColor, 10), borderRadius: '50%', zIndex: 3 }} />
          <div style={{ position: 'absolute', top: 10 * scale, left: 44 * scale, width: 18 * scale, height: 18 * scale, background: shade(hairColor, 14), borderRadius: '50%', zIndex: 3 }} />
          <div style={{ position: 'absolute', top: 4 * scale, right: 2 * scale, width: 22 * scale, height: 22 * scale, background: shade(hairColor, 8), borderRadius: '50%', zIndex: 3 }} />
          <div style={{ position: 'absolute', top: 22 * scale, left: 4 * scale, width: 16 * scale, height: 16 * scale, background: shade(hairColor, 6), borderRadius: '50%', zIndex: 3 }} />
          <div style={{ position: 'absolute', top: 22 * scale, right: 4 * scale, width: 16 * scale, height: 16 * scale, background: shade(hairColor, 6), borderRadius: '50%', zIndex: 3 }} />
        </>
      )}

      {/* accessories */}
      {accessory === 'glasses' && (
        <div style={{
          position: 'absolute', top: 40 * scale, left: 12 * scale, width: 86 * scale, height: 22 * scale, zIndex: 6,
        }}>
          <div style={{ position: 'absolute', left: 4 * scale, top: 4 * scale, width: 30 * scale, height: 18 * scale, border: `${2.5 * scale}px solid rgba(240,235,227,.85)`, borderRadius: 8, background: 'rgba(200,220,235,0.16)' }} />
          <div style={{ position: 'absolute', right: 4 * scale, top: 4 * scale, width: 30 * scale, height: 18 * scale, border: `${2.5 * scale}px solid rgba(240,235,227,.85)`, borderRadius: 8, background: 'rgba(200,220,235,0.16)' }} />
          <div style={{ position: 'absolute', left: 34 * scale, top: 10 * scale, width: 18 * scale, height: 3 * scale, background: 'rgba(240,235,227,.85)' }} />
        </div>
      )}
      {accessory === 'sunglasses' && (
        <div style={{ position: 'absolute', top: 40 * scale, left: 10 * scale, width: 90 * scale, height: 22 * scale, zIndex: 6 }}>
          <div style={{ position: 'absolute', left: 2 * scale, top: 2 * scale, width: 34 * scale, height: 20 * scale, background: '#1d1a24', borderRadius: '10px 10px 12px 12px', border: `2px solid rgba(255,255,255,.2)` }} />
          <div style={{ position: 'absolute', right: 2 * scale, top: 2 * scale, width: 34 * scale, height: 20 * scale, background: '#1d1a24', borderRadius: '10px 10px 12px 12px', border: `2px solid rgba(255,255,255,.2)` }} />
          <div style={{ position: 'absolute', left: 36 * scale, top: 8 * scale, width: 18 * scale, height: 3 * scale, background: '#1d1a24' }} />
        </div>
      )}
      {accessory === 'hat' && (
        <div style={{ position: 'absolute', top: 2 * scale, left: 0 * scale, width: 106 * scale, zIndex: 6 }}>
          <div style={{ margin: '0 auto', width: 68 * scale, height: 26 * scale, background: 'linear-gradient(180deg,#3a5a8a,#274069)', borderRadius: '16px 16px 4px 4px' }} />
          <div style={{ margin: '-2px auto 0', width: 96 * scale, height: 9 * scale, background: '#274069', borderRadius: 6 }} />
        </div>
      )}
      {accessory === 'beanie' && (
        <div style={{ position: 'absolute', top: 8 * scale, left: 4 * scale, width: 98 * scale, height: 34 * scale, background: 'linear-gradient(180deg,#e0537a,#b83a60)', borderRadius: '34px 34px 6px 6px', zIndex: 6 }}>
          <div style={{ position: 'absolute', top: -8 * scale, left: '50%', transform: 'translateX(-50%)', width: 20 * scale, height: 16 * scale, background: '#f0ebe3', borderRadius: '50%' }} />
        </div>
      )}
      {accessory === 'headphones' && (
        <div style={{ position: 'absolute', top: 6 * scale, left: -2 * scale, width: 114 * scale, height: 34 * scale, zIndex: 6 }}>
          <div style={{ margin: '0 auto', width: 92 * scale, height: 30 * scale, border: `${5 * scale}px solid #26222b`, borderBottom: 'none', borderRadius: '50px 50px 0 0' }} />
          <div style={{ position: 'absolute', top: 20 * scale, left: 0, width: 16 * scale, height: 24 * scale, background: '#26222b', borderRadius: 6 }} />
          <div style={{ position: 'absolute', top: 20 * scale, right: 0, width: 16 * scale, height: 24 * scale, background: '#26222b', borderRadius: 6 }} />
        </div>
      )}
      {accessory === 'bow' && (
        <div style={{ position: 'absolute', top: 18 * scale, right: 8 * scale, zIndex: 6, transform: 'rotate(12deg)' }}>
          <div style={{ position: 'absolute', width: 14 * scale, height: 11 * scale, background: '#e0537a', borderRadius: '50% 50% 0 50%' }} />
          <div style={{ position: 'absolute', left: 12 * scale, width: 14 * scale, height: 11 * scale, background: '#e0537a', borderRadius: '50% 50% 50% 0' }} />
          <div style={{ position: 'absolute', top: 3 * scale, left: 10 * scale, width: 5 * scale, height: 5 * scale, background: '#b83a60', borderRadius: '50%' }} />
        </div>
      )}
      {accessory === 'flower' && (
        <div style={{ position: 'absolute', top: 20 * scale, left: 84 * scale, zIndex: 6 }}>
          <div style={{ width: 15 * scale, height: 15 * scale, background: '#f08aa8', borderRadius: '50% 50% 0 50%', boxShadow: `0 0 ${6 * scale}px rgba(240,138,168,.6)` }} />
        </div>
      )}
      {accessory === 'scarf' && (
        <div style={{ position: 'absolute', top: 96 * scale, left: 20 * scale, width: 70 * scale, height: 16 * scale, background: 'linear-gradient(180deg,#c94f3a,#a03a2a)', borderRadius: 10, zIndex: 6 }}>
          <div style={{ position: 'absolute', top: 12 * scale, left: 8 * scale, width: 14 * scale, height: 26 * scale, background: '#a03a2a', borderRadius: '0 0 6px 6px' }} />
        </div>
      )}
      {accessory === 'earrings' && (
        <>
          <div style={{ position: 'absolute', top: 92 * scale, left: 10 * scale, width: 5 * scale, height: 9 * scale, background: '#e8c39e', borderRadius: 3, zIndex: 6 }} />
          <div style={{ position: 'absolute', top: 92 * scale, right: 10 * scale, width: 5 * scale, height: 9 * scale, background: '#e8c39e', borderRadius: 3, zIndex: 6 }} />
        </>
      )}
      {accessory === 'mask' && (
        <div style={{ position: 'absolute', top: 52 * scale, left: 22 * scale, width: 66 * scale, height: 26 * scale, background: 'rgba(245,235,230,0.9)', borderRadius: '12px 12px 16px 16px', zIndex: 6, border: '1px solid rgba(0,0,0,0.05)' }} />
      )}
    </div>
  );
}

function isTopLike(t: string) { return t === 'top' || t === 'tee' || t === 'dress'; }
function shade(hex: string, amt: number) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
  const b = Math.max(0, Math.min(255, (n & 255) + amt));
  return `rgb(${r},${g},${b})`;
}
