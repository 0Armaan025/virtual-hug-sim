"use client";
import { Character } from '@/types';

export default function CharacterSprite({
  character, walking = false, flip = false,
}: { character: Character; walking?: boolean; flip?: boolean }) {
  const { hairColor, hairStyle, skinColor, outfitColor, outfitType, accessory } = character;

  return (
    <div style={{
      position: 'relative', width: 96, height: 130,
      transform: flip ? 'scaleX(-1)' : undefined,
      filter: 'drop-shadow(0 6px 6px rgba(90,61,43,0.18))',
    }}>
      {/* Hair behind (long hair) */}
      {hairStyle === 'long' && (
        <div style={{
          position: 'absolute', top: 14, left: 4, width: 88, height: 70,
          background: hairColor, borderRadius: '40px 40px 20px 20px', opacity: 0.9, zIndex: 0,
        }} />
      )}
      {hairStyle === 'bun' && (
        <div style={{
          position: 'absolute', top: 8, left: 36, width: 24, height: 24,
          background: hairColor, borderRadius: '50%', zIndex: 0,
        }} />
      )}

      {/* Body / outfit */}
      <div style={{
        position: 'absolute', bottom: 0, left: 18, width: 60, height: 56,
        background: outfitColor, zIndex: 1,
        borderRadius: outfitType === 'dress' ? '30px 30px 12px 12px' : '18px 18px 6px 6px',
        border: '3px solid rgba(0,0,0,0.08)',
        transition: 'background 0.3s',
      }}>
        {outfitType === 'hoodie' && (
          <div style={{
            position: 'absolute', top: -1, left: 20, width: 20, height: 10,
            background: outfitColor, borderRadius: '0 0 10px 10px', border: '2px solid rgba(0,0,0,0.08)',
          }} />
        )}
        {outfitType === 'jacket' && (
          <div style={{
            position: 'absolute', top: 0, bottom: 0, left: 28, width: 4, background: 'rgba(0,0,0,0.12)',
          }} />
        )}
        {(outfitType === 'cardigan' || outfitType === 'sweater') && (
          <div style={{
            position: 'absolute', top: 6, left: 28, width: 4, height: 44,
            background: 'rgba(0,0,0,0.08)', borderRadius: 2,
          }} />
        )}
      </div>

      {/* Arms */}
      <div style={{
        position: 'absolute', bottom: 20, left: 6, width: 14, height: 40, background: outfitColor,
        borderRadius: 7, border: '2px solid rgba(0,0,0,0.08)', zIndex: 0,
        transform: walking ? 'rotate(-18deg)' : 'rotate(0deg)',
        transformOrigin: 'top center', transition: 'transform 0.2s',
      }} />
      <div style={{
        position: 'absolute', bottom: 20, right: 6, width: 14, height: 40, background: outfitColor,
        borderRadius: 7, border: '2px solid rgba(0,0,0,0.08)', zIndex: 0,
        transform: walking ? 'rotate(18deg)' : 'rotate(0deg)',
        transformOrigin: 'top center', transition: 'transform 0.2s',
      }} />

      {/* Legs (walking bob) */}
      <div style={{
        position: 'absolute', bottom: -14, left: 34, width: 12, height: 18,
        background: '#5a3d2b', borderRadius: '3px 3px 6px 6px', zIndex: 0,
        transform: walking ? 'translateY(-3px)' : undefined, transition: 'transform 0.2s',
      }} />
      <div style={{
        position: 'absolute', bottom: -14, right: 34, width: 12, height: 18,
        background: '#5a3d2b', borderRadius: '3px 3px 6px 6px', zIndex: 0,
        transform: walking ? 'translateY(-3px)' : undefined, transition: 'transform 0.2s',
      }} />

      {/* Head */}
      <div style={{
        position: 'absolute', top: 26, left: 16, width: 64, height: 64,
        background: skinColor, borderRadius: '50%',
        border: '3px solid rgba(0,0,0,0.08)', zIndex: 2,
      }}>
        {/* Eyes */}
        <div style={{
          position: 'absolute', top: 28, left: 16, width: 8, height: 10,
          background: '#3a2a1a', borderRadius: '50%',
          animation: walking ? 'blink 3s infinite' : undefined,
        }} />
        <div style={{
          position: 'absolute', top: 28, right: 16, width: 8, height: 10,
          background: '#3a2a1a', borderRadius: '50%',
          animation: walking ? 'blink 3s infinite' : undefined,
        }} />
        {/* Cheeks */}
        <div style={{ position: 'absolute', top: 40, left: 10, width: 8, height: 5, background: 'rgba(212,106,106,0.35)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: 40, right: 10, width: 8, height: 5, background: 'rgba(212,106,106,0.35)', borderRadius: '50%' }} />
        {/* Smile */}
        <div style={{
          position: 'absolute', top: 42, left: 26, width: 14, height: 7,
          borderBottom: '3px solid #a05a3a', borderRadius: '0 0 10px 10px',
        }} />
      </div>

      {/* Hair top */}
      <div style={{
        position: 'absolute', top: 14, left: 12, width: 72, height: 34,
        background: hairColor, zIndex: 3,
        borderRadius: hairStyle === 'spiky' ? '30% 30% 0 0' : '50% 50% 20% 20%',
        opacity: 0.95,
      }} />
      {hairStyle === 'curly' && (
        <>
          <div style={{ position: 'absolute', top: 10, left: 8, width: 16, height: 16, background: hairColor, borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 12, left: 40, width: 14, height: 14, background: hairColor, borderRadius: '50%' }} />
          <div style={{ position: 'absolute', top: 10, right: 8, width: 16, height: 16, background: hairColor, borderRadius: '50%' }} />
        </>
      )}
      {hairStyle === 'spiky' && (
        <>
          <div style={{ position: 'absolute', top: 2, left: 28, width: 8, height: 16, background: hairColor, clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }} />
          <div style={{ position: 'absolute', top: 4, left: 44, width: 8, height: 14, background: hairColor, clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }} />
          <div style={{ position: 'absolute', top: 2, left: 58, width: 8, height: 16, background: hairColor, clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }} />
        </>
      )}

      {/* Accessories */}
      {accessory === 'glasses' && (
        <div style={{
          position: 'absolute', top: 52, left: 22, width: 52, height: 16, zIndex: 4,
          border: '3px solid #5a3d2b', borderRadius: 8,
          background: 'rgba(255,255,255,0.25)',
        }} />
      )}
      {accessory === 'hat' && (
        <div style={{
          position: 'absolute', top: 6, left: 4, width: 88, height: 22, zIndex: 4,
          background: '#5a3d2b', borderRadius: '12px 12px 0 0',
        }}>
          <div style={{ position: 'absolute', top: 18, left: -6, width: 100, height: 6, background: '#3a2a1a', borderRadius: 3 }} />
        </div>
      )}
      {accessory === 'bow' && (
        <div style={{ position: 'absolute', top: 16, left: 78, width: 18, height: 12, zIndex: 4 }}>
          <div style={{ position: 'absolute', width: 9, height: 12, background: '#d46a6a', borderRadius: '50% 50% 0 50%' }} />
          <div style={{ position: 'absolute', left: 9, width: 9, height: 12, background: '#d46a6a', borderRadius: '50% 50% 50% 0' }} />
        </div>
      )}
      {accessory === 'flower' && (
        <div style={{
          position: 'absolute', top: 18, left: 80, width: 14, height: 14, zIndex: 4,
          background: '#e88bb0', borderRadius: '50% 50% 0 50%',
        }} />
      )}
      {accessory === 'scarf' && (
        <div style={{
          position: 'absolute', top: 88, left: 22, width: 52, height: 10, zIndex: 4,
          background: '#c47a4a', borderRadius: 5,
        }} />
      )}
      {accessory === 'earrings' && (
        <>
          <div style={{ position: 'absolute', top: 76, left: 18, width: 5, height: 8, background: '#e8c39e', borderRadius: 3, zIndex: 4 }} />
          <div style={{ position: 'absolute', top: 76, right: 18, width: 5, height: 8, background: '#e8c39e', borderRadius: 3, zIndex: 4 }} />
        </>
      )}
    </div>
  );
}
