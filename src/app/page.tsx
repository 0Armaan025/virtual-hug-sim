"use client";
import { useState } from 'react';
import CharacterBuilder from '@/components/CharacterBuilder';
import HugScene2D from '@/components/HugScene2D';
import HugScene3D from '@/components/HugScene3D';
import SoundPlayer from '@/components/SoundPlayer';
import LiveHugRoom from '@/components/LiveHugRoom';
import Particles from '@/components/Particles';
import HugMessage from '@/components/HugMessage';
import { HUG_TYPES } from '@/lib/hug-types';
import { playHugSound } from '@/lib/sounds';

export default function HomePage() {
  const [mode, setMode] = useState<'2d' | '3d'>('2d');
  const [showParticles, setShowParticles] = useState(false);
  const [message, setMessage] = useState('');
  const [hugCount, setHugCount] = useState(0);

  const triggerParticlesAndSound = () => {
    setShowParticles(true);
    playHugSound('G', 1500, 3);
    setTimeout(() => setShowParticles(false), 2000);
  };

  const sendGlobalHug = () => {
    const hug = HUG_TYPES[Math.floor(Math.random() * HUG_TYPES.length)];
    setMessage(`💝 You sent a ${hug.label} hug into the universe!`);
    setHugCount(c => c + 1);
    triggerParticlesAndSound();
    playHugSound(hug.soundNote, hug.durationMs, hug.intensity);
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #fff8f0 0%, #fff5eb 30%, #ffe4d6 70%, #fff0e6 100%)',
      fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
      padding: '2rem 1rem',
      overflowX: 'hidden',
    }}>
      <Particles active={showParticles} />
      <HugMessage message={message} onDismiss={() => setMessage('')} />

      {/* Header */}
      <header style={{ textAlign: 'center', padding: '2rem 1rem', position: 'relative' }}>
        <div style={{
          display: 'inline-block', padding: '0.3rem 1rem', borderRadius: '2rem',
          background: '#fff5eb', border: '2px solid #f5d0a9', marginBottom: '1rem',
          fontSize: '0.75rem', fontWeight: 700, color: '#c47a4a', letterSpacing: '0.08em',
        }}>
          VIRTUAL HUG SIMULATOR
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#c47a4a', margin: '0.2rem 0', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          Virtual Hug Simulator
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#a07850', maxWidth: '500px', margin: '0.75rem auto 0', lineHeight: 1.6 }}>
          A cozy, interactive space where you can customize characters, share hugs with animations and sound, and connect with people in real-time rooms.
        </p>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ padding: '0.3rem 0.8rem', borderRadius: '1rem', background: '#fff', border: '1px solid #f5d0a9', fontSize: '0.75rem', color: '#8a6d4b', fontWeight: 600 }}>✨ 2D & 3D Modes</span>
          <span style={{ padding: '0.3rem 0.8rem', borderRadius: '1rem', background: '#fff', border: '1px solid #f5d0a9', fontSize: '0.75rem', color: '#8a6d4b', fontWeight: 600 }}>🎵 Sound Effects</span>
          <span style={{ padding: '0.3rem 0.8rem', borderRadius: '1rem', background: '#fff', border: '1px solid #f5d0a9', fontSize: '0.75rem', color: '#8a6d4b', fontWeight: 600 }}>🌐 Live Rooms</span>
          <span style={{ padding: '0.3rem 0.8rem', borderRadius: '1rem', background: '#fff', border: '1px solid #f5d0a9', fontSize: '0.75rem', color: '#8a6d4b', fontWeight: 600 }}>💝 Custom Hugs</span>
        </div>
      </header>

      {/* Hug Counter & Global Send */}
      <section style={{ maxWidth: '700px', margin: '0 auto 2.5rem', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '1.5rem',
          background: '#fff', borderRadius: '2rem', padding: '1rem 2rem',
          boxShadow: '0 6px 25px rgba(212,106,106,0.1)', border: '2px solid #f5d0a9',
        }}>
          <div>
            <p style={{ fontSize: '0.7rem', color: '#c47a4a', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 800, margin: 0 }}>Hug Counter</p>
            <p style={{ fontSize: '2rem', fontWeight: 900, color: '#d46a6a', margin: 0, lineHeight: 1 }}>{hugCount}</p>
          </div>
          <div style={{ width: 1, height: 40, background: '#f5d0a9' }} />
          <button
            onClick={() => { sendGlobalHug(); triggerParticlesAndSound(); }}
            style={{
              padding: '0.8rem 1.8rem', borderRadius: '2rem', border: 'none',
              background: 'linear-gradient(135deg, #d46a6a, #c47a4a)', color: '#fff',
              fontWeight: 800, fontSize: '1rem', cursor: 'pointer', letterSpacing: '0.02em',
              boxShadow: '0 5px 20px rgba(212,106,106,0.3)', transition: 'transform 0.1s',
            }}
            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.96)')}
            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            💝 Send Global Hug
          </button>
        </div>
      </section>

      {/* Character Builder */}
      <section style={{ maxWidth: '580px', margin: '0 auto 3rem' }}>
        <CharacterBuilder />
      </section>

      {/* Mode Toggle + Scene */}
      <section style={{ maxWidth: '720px', margin: '0 auto 3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button onClick={() => setMode('2d')} style={{
            padding: '0.6rem 1.5rem', borderRadius: '1.5rem', border: '2px solid',
            borderColor: mode === '2d' ? '#d46a6a' : '#f5d0a9',
            background: mode === '2d' ? '#fff5eb' : '#fff', color: '#8a6d4b',
            fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
          }}>2D Scene</button>
          <button onClick={() => setMode('3d')} style={{
            padding: '0.6rem 1.5rem', borderRadius: '1.5rem', border: '2px solid',
            borderColor: mode === '3d' ? '#d46a6a' : '#f5d0a9',
            background: mode === '3d' ? '#fff5eb' : '#fff', color: '#8a6d4b',
            fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
          }}>3D Scene</button>
        </div>
        {mode === '2d' ? <HugScene2D /> : <HugScene3D />}
      </section>

      {/* Sound Player */}
      <section style={{ maxWidth: '640px', margin: '0 auto 3rem' }}>
        <SoundPlayer />
      </section>

      {/* Live Room */}
      <section style={{ maxWidth: '640px', margin: '0 auto 3rem' }}>
        <LiveHugRoom />
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: 'center', padding: '2rem 1rem', color: '#c4a484',
        fontSize: '0.85rem', borderTop: '2px solid #f5d0a9', marginTop: '2rem',
      }}>
        <p style={{ margin: 0 }}>Made with 💝 • Virtual Hug Simulator</p>
        <p style={{ margin: '0.25rem 0 0', opacity: 0.7, fontSize: '0.75rem' }}>
          Cozy. Warm. Connected.
        </p>
      </footer>
    </main>
  );
}
