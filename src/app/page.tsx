"use client";
import { useState } from 'react';
import CharacterBuilder from '@/components/CharacterBuilder';
import RoomScene from '@/components/RoomScene';
import SoundPlayer from '@/components/SoundPlayer';
import Particles from '@/components/Particles';
import HugMessage from '@/components/HugMessage';
import { DEFAULT_CHARACTER } from '@/lib/character-state';
import { HUG_VARIANTS } from '@/types';
import { Character } from '@/types';

const STATS = [
  { label: 'Hugs shared', key: 'hugs' },
  { label: 'Rooms joined', key: 'rooms' },
];

export default function HomePage() {
  const [character, setCharacter] = useState<Character>(DEFAULT_CHARACTER);
  const [roomId, setRoomId] = useState('xyz');
  const [mode, setMode] = useState<'room' | 'sound'>('room');
  const [particles, setParticles] = useState(false);
  const [message, setMessage] = useState('');
  const [counts, setCounts] = useState({ hugs: 0, rooms: 0 });
  const [joined, setJoined] = useState(false);
  const [socketUrl, setSocketUrl] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('hugroom_socket_url') || '';
    return '';
  });

  const saveSocketUrl = () => {
    localStorage.setItem('hugroom_socket_url', socketUrl);
    window.location.reload();
  };


  const celebrate = (text: string) => {
    setMessage(text);
    setParticles(true);
    setTimeout(() => setParticles(false), 2400);
  };

  const onHugSent = (variant: string) => {
    setCounts(c => ({ ...c, hugs: c.hugs + 1 }));
    const v = HUG_VARIANTS.find(x => x.id === variant);
    celebrate(`💝 ${v?.label ?? 'Hug'} hug delivered!`);
  };

  return (
    <main style={{
      minHeight: '100vh', position: 'relative', overflow: 'hidden',
      background: 'radial-gradient(ellipse 90% 60% at 50% -10%, #3a2836 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 85% 100%, rgba(90,122,224,.14) 0%, transparent 60%), linear-gradient(180deg, #1b1620 0%, #221a26 45%, #1a151e 100%)',
      color: '#f5ebe6', fontFamily: 'ui-rounded, system-ui, -apple-system, Segoe UI, sans-serif',
    }}>
      {/* grain */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: .05, zIndex: 0,
        backgroundImage: 'repeating-conic-gradient(rgba(255,255,255,.5) 0% 0.0001%, transparent 0% 0.0002%)',
        backgroundSize: '3px 3px',
      }} />
      <Particles active={particles} />
      <HugMessage message={message} onDismiss={() => setMessage('')} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '2rem 1.1rem 3rem' }}>
        {/* NAV */}
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '2.25rem', flexWrap: 'wrap', gap: '.8rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
            <div style={{
              width: 34, height: 34, borderRadius: 12, display: 'grid', placeItems: 'center',
              background: 'linear-gradient(160deg,#e0537a,#8a5ae0)', boxShadow: '0 6px 18px rgba(224,83,122,.4)',
              fontSize: '1rem',
            }}>💝</div>
            <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>Hugroom</span>
          </div>
          <div style={{
            display: 'flex', gap: 2, background: 'rgba(255,255,255,.05)',
            border: '1px solid rgba(255,255,255,.08)', borderRadius: 999, padding: 3,
          }}>
            {(['room', 'sound'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                padding: '.42rem 1rem', borderRadius: 999, border: 'none', cursor: 'pointer',
                fontSize: '.78rem', fontWeight: 700, textTransform: 'capitalize',
                background: mode === m ? 'linear-gradient(160deg,#e0537a,#c73a63)' : 'transparent',
                color: mode === m ? '#fff' : 'rgba(245,235,230,.6)', transition: 'all .18s',
              }}>{m === 'room' ? 'Room' : 'Sounds'}</button>
            ))}
          </div>
        </nav>

        {/* HERO */}
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px',
            borderRadius: 999, background: 'rgba(224,83,122,.13)',
            border: '1px solid rgba(255,143,163,.25)', color: '#ffd9e1',
            fontSize: '.68rem', fontWeight: 700, letterSpacing: '.04em', marginBottom: '1rem',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6ee7a8' }} />
            Live cozy rooms · real-time hugs
          </div>
          <h1 style={{
            margin: 0, fontSize: 'clamp(2.1rem, 5.2vw, 3.6rem)', fontWeight: 900,
            letterSpacing: '-0.035em', lineHeight: 1.05,
            background: 'linear-gradient(160deg,#fff 30%,#ffb9c9 75%,#c9a0ff)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          }}>
            Hug someone<br />across the screen.
          </h1>
          <p style={{
            margin: '.9rem auto 0', maxWidth: 480, fontSize: '.95rem', lineHeight: 1.65,
            color: 'rgba(245,235,230,.55)',
          }}>
            Build your avatar, walk into the room, and share a hug with whoever's there.
          </p>
        </header>

        {/* ROOM BAR */}
        <section style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '.6rem', flexWrap: 'wrap', marginBottom: '1.4rem',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '.5rem',
            background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)',
            borderRadius: 999, padding: '4px 4px 4px 14px',
          }}>
            <span style={{ fontSize: '.72rem', color: 'rgba(245,235,230,.45)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>Room</span>
            <input
              value={roomId}
              onChange={e => setRoomId(e.target.value || 'cozy-living-room')}
              style={{
                width: 168, padding: '.42rem .7rem', borderRadius: 999, border: 'none',
                background: 'rgba(255,255,255,.06)', color: '#f5ebe6',
                fontSize: '.82rem', outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>
          <button
            onClick={() => { setRoomId(`room-${Math.random().toString(36).slice(2, 8)}`); setCounts(c => ({ ...c, rooms: c.rooms + 1 })); }}
            style={{
              padding: '.55rem 1rem', borderRadius: 999, cursor: 'pointer',
              background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.09)',
              color: 'rgba(245,235,230,.75)', fontSize: '.78rem', fontWeight: 700,
            }}
          >🎲 New room</button>
          <button
            onClick={() => setJoined(true)}
            style={{
              padding: '.55rem 1.2rem', borderRadius: 999, cursor: 'pointer', border: 'none',
              background: 'linear-gradient(160deg,#e0537a,#c73a63)', color: '#fff',
              fontSize: '.82rem', fontWeight: 800,
              boxShadow: '0 8px 22px rgba(224,83,122,.4)',
            }}
          >🚪 Join Room</button>

          {/* Socket URL input (paste your serveo tunnel URL here) */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '.4rem',
            background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,143,163,.2)',
            borderRadius: 999, padding: '4px 4px 4px 10px',
          }}>
            <span style={{ fontSize: '.68rem', color: 'rgba(255,143,163,.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>Socket</span>
            <input
              value={socketUrl}
              onChange={e => setSocketUrl(e.target.value)}
              placeholder="https://xxxx.serveousercontent.com"
              style={{
                width: 200, padding: '.42rem .7rem', borderRadius: 999, border: 'none',
                background: 'rgba(255,255,255,.06)', color: '#f5ebe6',
                fontSize: '.78rem', outline: 'none', fontFamily: 'inherit',
              }}
            />
            <button
              onClick={saveSocketUrl}
              title="Save socket URL (paste serveo URL here)"
              style={{
                padding: '.42rem .75rem', borderRadius: 999, border: 'none', cursor: 'pointer',
                background: 'rgba(255,143,163,.2)', color: '#ffd9e1',
                fontSize: '.72rem', fontWeight: 800,
              }}
            >Save</button>
          </div>
        </section>

        {/* STATS */}
        <section style={{
          display: 'flex', gap: '.7rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.8rem',
        }}>
          {STATS.map(s => (
            <div key={s.key} style={{
              background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
              borderRadius: 18, padding: '.6rem 1.2rem', textAlign: 'center', minWidth: 130,
            }}>
              <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#ffb9c9' }}>{counts[s.key as keyof typeof counts]}</p>
              <p style={{ margin: 0, fontSize: '.66rem', color: 'rgba(245,235,230,.45)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>{s.label}</p>
            </div>
          ))}
        </section>

        {/* MAIN */}
        {mode === 'room' ? (
          <>
            <RoomScene myCharacter={character} roomId={roomId} joined={joined} />
            <div style={{ marginTop: '2rem' }}>
              <CharacterBuilder character={character} onChange={setCharacter} />
            </div>
          </>
        ) : (
          <SoundPlayer />
        )}

        <footer style={{
          marginTop: '3rem', paddingTop: '1.5rem', textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,.07)',
          fontSize: '.72rem', color: 'rgba(245,235,230,.35)',
        }}>
          Hugroom · built for cozy connections
        </footer>
      </div>
    </main>
  );
}
