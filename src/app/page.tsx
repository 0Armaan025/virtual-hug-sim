"use client";
import { useState } from 'react';
import CharacterBuilder from '@/components/CharacterBuilder';
import RoomScene from '@/components/RoomScene';
import HugScene3D from '@/components/HugScene3D';
import SoundPlayer from '@/components/SoundPlayer';
import LiveHugRoom from '@/components/LiveHugRoom';
import Particles from '@/components/Particles';
import HugMessage from '@/components/HugMessage';
import { DEFAULT_CHARACTER } from '@/lib/character-state';
import { HUG_TYPES } from '@/lib/hug-types';
import { playHugSound } from '@/lib/sounds';
import { Character } from '@/types';

export default function HomePage() {
  const [character, setCharacter] = useState<Character>(DEFAULT_CHARACTER);
  const [mode, setMode] = useState<'room' | '3d'>('room');
  const [showParticles, setShowParticles] = useState(false);
  const [message, setMessage] = useState('');
  const [hugCount, setHugCount] = useState(0);
  const [roomId, setRoomId] = useState('cozy-living-room');

  const sendGlobalHug = () => {
    const hug = HUG_TYPES[Math.floor(Math.random() * HUG_TYPES.length)];
    setMessage(`💝 You sent a ${hug.label} hug into the universe!`);
    setHugCount(c => c + 1);
    setShowParticles(true);
    playHugSound(hug.soundNote, hug.durationMs, hug.intensity);
    setTimeout(() => setShowParticles(false), 2200);
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #fff8f0 0%, #fff5eb 30%, #ffe4d6 70%, #fff0e6 100%)',
      fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
      padding: '2rem 1rem', overflowX: 'hidden',
    }}>
      <Particles active={showParticles} />
      <HugMessage message={message} onDismiss={() => setMessage('')} />

      <header style={{ textAlign: 'center', padding: '1.5rem 1rem 2rem' }}>
        <div style={{
          display: 'inline-block', padding: '0.3rem 1rem', borderRadius: '2rem',
          background: '#fff5eb', border: '2px solid #f5d0a9', marginBottom: '0.75rem',
          fontSize: '0.7rem', fontWeight: 700, color: '#c47a4a', letterSpacing: '0.12em',
        }}>VIRTUAL HUG SIMULATOR</div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', color: '#c47a4a', margin: '0.2rem 0', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Cozy Hug Rooms
        </h1>
        <p style={{ fontSize: '1rem', color: '#a07850', maxWidth: 520, margin: '0.5rem auto 0', lineHeight: 1.6 }}>
          Customize your character, walk around the room, meet people, and share hugs — live, cozy, together.
        </p>
        <div style={{ marginTop: '0.9rem', display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {['🚶 Move Around', '👥 People List', '💝 8 Hug Types', '🎵 Sound', '🧊 3D Mode', '🌐 Live Sockets'].map(t => (
            <span key={t} style={{
              padding: '0.3rem 0.8rem', borderRadius: '1rem', background: '#fff',
              border: '1px solid #f5d0a9', fontSize: '0.72rem', color: '#8a6d4b', fontWeight: 600,
            }}>{t}</span>
          ))}
        </div>
      </header>

      <section style={{ maxWidth: 720, margin: '0 auto 2.5rem', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center',
          background: '#fff', borderRadius: '2rem', padding: '0.9rem 1.75rem',
          boxShadow: '0 6px 25px rgba(212,106,106,0.1)', border: '2px solid #f5d0a9',
        }}>
          <div>
            <p style={{ fontSize: '0.65rem', color: '#c47a4a', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, margin: 0 }}>Hugs Shared</p>
            <p style={{ fontSize: '1.8rem', fontWeight: 900, color: '#d46a6a', margin: 0, lineHeight: 1 }}>{hugCount}</p>
          </div>
          <div style={{ width: 1, height: 36, background: '#f5d0a9' }} />
          <button
            onClick={sendGlobalHug}
            style={{
              padding: '0.75rem 1.7rem', borderRadius: '2rem', border: 'none',
              background: 'linear-gradient(135deg, #d46a6a, #c47a4a)', color: '#fff',
              fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
              boxShadow: '0 5px 20px rgba(212,106,106,0.3)', transition: 'transform 0.1s',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >💝 Send Global Hug</button>
        </div>
      </section>

      <section style={{ maxWidth: 580, margin: '0 auto 2.5rem' }}>
        <CharacterBuilder character={character} onChange={setCharacter} />
      </section>

      {/* Room controls */}
      <section style={{ maxWidth: 820, margin: '0 auto 1.5rem' }}>
        <div style={{
          display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem',
        }}>
          <div style={{ display: 'flex', background: '#fff', borderRadius: '1.5rem', padding: 4, border: '2px solid #f5d0a9' }}>
            <button onClick={() => setMode('room')} style={{
              padding: '0.55rem 1.3rem', borderRadius: '1.5rem', border: 'none', cursor: 'pointer',
              background: mode === 'room' ? 'linear-gradient(135deg,#d46a6a,#c47a4a)' : 'transparent',
              color: mode === 'room' ? '#fff' : '#8a6d4b', fontWeight: 700, fontSize: '0.85rem',
            }}>🏠 Room</button>
            <button onClick={() => setMode('3d')} style={{
              padding: '0.55rem 1.3rem', borderRadius: '1.5rem', border: 'none', cursor: 'pointer',
              background: mode === '3d' ? 'linear-gradient(135deg,#d46a6a,#c47a4a)' : 'transparent',
              color: mode === '3d' ? '#fff' : '#8a6d4b', fontWeight: 700, fontSize: '0.85rem',
            }}>🧊 3D</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <input
              value={roomId}
              onChange={e => setRoomId(e.target.value || 'cozy-living-room')}
              placeholder="Room name"
              style={{
                padding: '0.55rem 1rem', borderRadius: '1.5rem', border: '2px solid #f5d0a9',
                background: '#fff', fontSize: '0.85rem', color: '#5a3d2b', width: 180, outline: 'none',
              }}
            />
            <button onClick={() => setRoomId(`room-${Math.random().toString(36).slice(2, 7)}`)} title="Random room" style={{
              padding: '0.55rem 0.9rem', borderRadius: '1.5rem', border: 'none', background: '#c47a4a',
              color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem',
            }}>🎲</button>
          </div>
        </div>

        {mode === 'room' ? (
          <RoomScene myCharacter={character} roomId={roomId} onHugSent={() => setHugCount(c => c + 1)} />
        ) : (
          <HugScene3D />
        )}
      </section>

      <section style={{ maxWidth: 640, margin: '0 auto 2.5rem' }}>
        <SoundPlayer />
      </section>

      <section style={{ maxWidth: 640, margin: '0 auto 2.5rem' }}>
        <LiveHugRoom />
      </section>

      <footer style={{
        textAlign: 'center', padding: '1.5rem 1rem', color: '#c4a484',
        fontSize: '0.8rem', borderTop: '2px solid #f5d0a9', marginTop: '2rem',
      }}>
        <p style={{ margin: 0 }}>Made with 💝 · Virtual Hug Simulator</p>
        <p style={{ margin: '0.2rem 0 0', opacity: 0.7, fontSize: '0.72rem' }}>Cozy. Warm. Connected.</p>
      </footer>
    </main>
  );
}
