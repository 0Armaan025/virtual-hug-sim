"use client";
import { useState, useRef } from 'react';
import { HUG_TYPES } from '@/lib/hug-types';
import { playHugSound, playBackgroundMusic } from '@/lib/sounds';

export default function SoundPlayer() {
  const [volume, setVolume] = useState(0.5);
  const [bgPlaying, setBgPlaying] = useState(false);
  const bgStopRef = useRef<(() => void) | null>(null);

  const handlePlay = (hug: typeof HUG_TYPES[0]) => {
    playHugSound(hug.soundNote, hug.durationMs, hug.intensity);
  };

  const toggleBackground = () => {
    if (bgPlaying) {
      bgStopRef.current?.();
      setBgPlaying(false);
    } else {
      const stop = playBackgroundMusic();
      bgStopRef.current = stop || null;
      setBgPlaying(true);
      setTimeout(() => {
        stop?.();
        setBgPlaying(false);
        bgStopRef.current = null;
      }, 10000);
    }
  };

  return (
    <div style={{
      background: '#fff8f0', borderRadius: '1.5rem', padding: '1.5rem',
      maxWidth: '600px', margin: '0 auto', boxShadow: '0 4px 20px rgba(212,106,106,0.1)',
    }}>
      <h3 style={{ color: '#c47a4a', marginBottom: '1rem', textAlign: 'center' }}>Sounds</h3>

      {/* Background music toggle */}
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <button
          onClick={toggleBackground}
          style={{
            padding: '0.6rem 1.2rem', borderRadius: '1rem', border: 'none',
            background: bgPlaying ? '#8a6d4b' : '#d46a6a', color: '#fff',
            fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          {bgPlaying ? 'Stop Background Music' : 'Play Cozy Background Music'}
        </button>
      </div>

      {/* Hug sound buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
        {HUG_TYPES.map(ht => (
          <button
            key={ht.id}
            onClick={() => handlePlay(ht)}
            style={{
              padding: '0.5rem 0.8rem', borderRadius: '0.75rem',
              border: '2px solid #f5d0a9', background: '#fff',
              color: '#8a6d4b', fontSize: '0.8rem', cursor: 'pointer',
              transition: 'all 0.15s', fontWeight: 600,
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#d46a6a')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#f5d0a9')}
          >
            {ht.label}
          </button>
        ))}
      </div>

      {/* Volume */}
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <label style={{ fontSize: '0.85rem', color: '#8a6d4b', fontWeight: 600 }}>
          Volume: {Math.round(volume * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={e => setVolume(parseFloat(e.target.value))}
          style={{ width: '200px', marginLeft: '0.5rem' }}
        />
      </div>
    </div>
  );
}
