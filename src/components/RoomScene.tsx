"use client";
import { useEffect, useRef, useState, useCallback } from 'react';
import CharacterSprite from './CharacterSprite';
import { Character } from '@/types';
import { useSocket } from '@/lib/use-socket';
import { HUG_TYPES } from '@/lib/hug-types';
import { playHugSound } from '@/lib/sounds';

interface RoomPlayer {
  id: string;
  name: string;
  character: Character;
  x: number;
  y: number;
  isSelf?: boolean;
  isNpc?: boolean;
  walking?: boolean;
  hugUntil?: number;
  wanderT?: number;
  dirX?: number;
  dirY?: number;
}

const NPC_TEMPLATES: Omit<RoomPlayer, 'x' | 'y' | 'isNpc' | 'walking'>[] = [
  {
    id: 'npc-1', name: 'Mia',
    character: { id: 'npc-1', name: 'Mia', hairColor: '#8b4513', hairStyle: 'long', skinColor: '#f0c8a0', outfitColor: '#d46a6a', outfitType: 'dress', accessory: 'flower' },
  },
  {
    id: 'npc-2', name: 'Theo',
    character: { id: 'npc-2', name: 'Theo', hairColor: '#2a1a0f', hairStyle: 'short', skinColor: '#b8815f', outfitColor: '#5a7a8a', outfitType: 'hoodie', accessory: 'glasses' },
  },
  {
    id: 'npc-3', name: 'Luna',
    character: { id: 'npc-3', name: 'Luna', hairColor: '#c9a0dc', hairStyle: 'bun', skinColor: '#f5d0a9', outfitColor: '#7a8b6a', outfitType: 'cardigan', accessory: 'bow' },
  },
];

export default function RoomScene({ myCharacter, roomId, onHugSent }: {
  myCharacter: Character;
  roomId: string;
  onHugSent?: () => void;
}) {
  const { socket, connected } = useSocket();
  const roomRef = useRef<HTMLDivElement>(null);
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [selectedHug, setSelectedHug] = useState('warm-hug');
  const [hugMsg, setHugMsg] = useState('');
  const keys = useRef<{ [k: string]: boolean }>({});

  // ---- init (self + NPCs) ----
  useEffect(() => {
    const npcs = NPC_TEMPLATES.map((t, i) => ({
      ...t, isNpc: true as const,
      x: 18 + i * 22 + Math.random() * 8, y: 40 + Math.random() * 20,
    }));
    setPlayers(prev => {
      const others = prev.filter(p => !p.isSelf);
      return [{ id: 'me', name: myCharacter.name || 'You', character: myCharacter, x: 50, y: 55, isSelf: true as const }, ...others, ...npcs];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep self character fresh
  useEffect(() => {
    setPlayers(prev => prev.map(p => (p.isSelf ? { ...p, name: myCharacter.name || 'You', character: myCharacter } : p)));
  }, [myCharacter]);

  // ---- socket sync ----
  useEffect(() => {
    if (!socket) return;
    const join = () => {
      socket.emit('join-room', { room: roomId, player: { name: myCharacter.name || 'You', character: myCharacter } });
    };
    if (connected) join();

    const onUpdate = (dict: any) => {
      const list = Object.values(dict || {}).map((p: any) => ({
        id: p.id, name: p.name, character: p.character, x: p.x, y: p.y,
      }));
      setPlayers(prev => {
        const npcs = prev.filter(p => p.isNpc);
        const self = prev.find(p => p.isSelf);
        if (!self) return [...list, ...npcs];
        return [self, ...list.filter(p => p.id !== self.id), ...npcs];
      });
    };
    const onMoved = (d: any) => {
      setPlayers(prev => prev.map(p => (p.id === d.id ? { ...p, x: d.x, y: d.y, walking: true } : p)));
    };
    const onLeft = (id: string) => setPlayers(prev => prev.filter(p => p.id !== id));
    const onReceive = (d: any) => {
      const hug = HUG_TYPES.find(h => h.id === d.hugType) || HUG_TYPES[2];
      playHugSound(hug.soundNote, hug.durationMs, hug.intensity);
      setPlayers(prev => prev.map(p => (p.id === d.from ? { ...p, hugUntil: Date.now() + 1800 } : p)));
    };

    socket.on('players-update', onUpdate);
    socket.on('player-moved', onMoved);
    socket.on('player-left', onLeft);
    socket.on('receive-hug', onReceive);
    return () => {
      socket.off('players-update', onUpdate);
      socket.off('player-moved', onMoved);
      socket.off('player-left', onLeft);
      socket.off('receive-hug', onReceive);
    };
  }, [socket, connected, roomId, myCharacter]);

  // ---- keyboard movement ----
  useEffect(() => {
    const down = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true; };
    const up = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  const emitMove = useCallback((x: number, y: number) => {
    if (socket && connected) socket.emit('move', { room: roomId, x, y, character: players.find(p => p.isSelf)?.character });
  }, [socket, connected, roomId, players]);

  // ---- game loop ----
  useEffect(() => {
    let raf = 0;
    const speed = 0.55;
    const step = () => {
      setPlayers(prev => {
        const next = prev.map(p => ({ ...p }));
        const self = next.find(p => p.isSelf);

        // NPC wander
        next.forEach(p => {
          if (!p.isNpc || p.hugUntil) return;
          p.wanderT = (p.wanderT ?? Math.random() * 200) - 1;
          if (p.wanderT <= 0) { p.wanderT = 120 + Math.random() * 240; p.dirX = (Math.random() - 0.5); p.dirY = (Math.random() - 0.5); }
          p.x = Math.max(6, Math.min(94, p.x + (p.dirX ?? 0) * speed * 0.5));
          p.y = Math.max(18, Math.min(88, p.y + (p.dirY ?? 0) * speed * 0.5));
        });

        // self movement
        if (self) {
          let dx = 0, dy = 0;
          const k = keys.current;
          if (k['arrowleft'] || k['a']) dx -= 1;
          if (k['arrowright'] || k['d']) dx += 1;
          if (k['arrowup'] || k['w']) dy -= 1;
          if (k['arrowdown'] || k['s']) dy += 1;
          const moving = dx !== 0 || dy !== 0;
          if (moving) {
            self.x = Math.max(6, Math.min(94, self.x + dx * speed));
            self.y = Math.max(18, Math.min(88, self.y + dy * speed));
          }
          self.walking = moving;
        }

        // hug timeout
        next.forEach(p => { if (p.hugUntil && Date.now() > p.hugUntil) p.hugUntil = undefined; });
        return next;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  // throttled position broadcast
  useEffect(() => {
    const t = setInterval(() => {
      const self = players.find(p => p.isSelf);
      if (self) emitMove(self.x, self.y);
    }, 100);
    return () => clearInterval(t);
  });

  const moveTo = (e: React.MouseEvent) => {
    const rect = roomRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPlayers(prev => prev.map(p => (p.isSelf ? { ...p, x, y } : p)));
    emitMove(x, y);
  };

  const hug = (target: RoomPlayer) => {
    const self = players.find(p => p.isSelf);
    if (!self) return;
    playHugSound(HUG_TYPES.find(h => h.id === selectedHug)?.soundNote || 'G', 2000, 4);
    setPlayers(prev => prev.map(p => (p.id === target.id ? { ...p, hugUntil: Date.now() + 2000 } : p)));
    if (socket && connected && !target.isNpc) {
      socket.emit('send-hug', { room: roomId, to: target.id, hugType: selectedHug, message: hugMsg });
    }
    onHugSent?.();
  };

  const self = players.find(p => p.isSelf);

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
      <style>{`@keyframes hugBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}`}</style>

      {/* ROOM */}
      <div
        ref={roomRef}
        onClick={moveTo}
        style={{
          position: 'relative', flex: '1 1 480px', minWidth: 320, height: 460,
          borderRadius: '1.5rem', overflow: 'hidden', cursor: 'crosshair',
          background: 'linear-gradient(180deg, #f6e3cd 0%, #f2d7bd 55%, #e8c4a0 100%)',
          boxShadow: 'inset 0 -20px 40px rgba(212,106,106,0.12), 0 10px 40px rgba(212,106,106,0.15)',
          border: '3px solid #f5d0a9',
        }}
      >
        {/* window */}
        <div style={{
          position: 'absolute', top: 20, left: 24, width: 90, height: 70,
          background: 'linear-gradient(160deg, #cfe8f5, #a8d4ec)', borderRadius: 12,
          border: '4px solid #c47a4a', boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
        }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 4, background: '#c47a4a' }} />
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 4, background: '#c47a4a' }} />
          <div style={{ position: 'absolute', top: 18, left: 14, width: 34, height: 18, background: '#fff', borderRadius: '50%', opacity: 0.7 }} />
        </div>

        {/* fireplace */}
        <div style={{
          position: 'absolute', bottom: 24, left: '38%', width: 110, height: 60,
          background: '#c47a4a', borderRadius: '8px 8px 0 0', border: '3px solid #a86a3a',
        }}>
          <div style={{
            position: 'absolute', bottom: 14, left: 25, width: 60, height: 34,
            background: 'linear-gradient(0deg, #e07b3a, #f5c96a)', borderRadius: 6,
            animation: 'hugBounce 2s ease-in-out infinite',
          }} />
        </div>

        {/* rug */}
        <div style={{
          position: 'absolute', bottom: 8, left: '10%', width: '80%', height: 90,
          background: 'radial-gradient(ellipse at center, #f3b8b8 0%, #e59a9a 70%, transparent 72%)',
          borderRadius: '50%', opacity: 0.55,
        }} />

        {/* players */}
        {players.map(p => {
          const d = self ? Math.hypot(((p.x - self.x) / 100) * 480, ((p.y - self.y) / 100) * 460) : 999;
          const canHug = p.isSelf ? false : d < 110;
          return (
            <div key={p.id} style={{
              position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
              transform: 'translate(-50%, -100%)', transition: 'left 0.05s linear, top 0.05s linear',
              zIndex: Math.round(100 - p.y),
              animation: p.hugUntil ? 'hugBounce 0.6s ease-in-out infinite' : undefined,
            }}>
              {/* name tag */}
              <div style={{
                position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)',
                background: p.isSelf ? '#d46a6a' : 'rgba(138,109,75,0.85)', color: '#fff',
                padding: '2px 8px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 700,
                whiteSpace: 'nowrap',
              }}>
                {p.name}{p.isNpc ? ' · NPC' : ''}
                <span style={{ marginLeft: 6, opacity: 0.9 }}>{connected && !p.isNpc ? '🟢' : '⚪'}</span>
              </div>

              <CharacterSprite character={p.character} walking={p.walking} flip={p.x < (self?.x ?? 100)} />

              {p.hugUntil && (
                <div style={{ position: 'absolute', top: -10, right: -20, fontSize: '1.6rem', animation: 'hugBounce 0.5s infinite' }}>💝</div>
              )}

              {canHug && (
                <button
                  onClick={e => { e.stopPropagation(); hug(p); }}
                  style={{
                    position: 'absolute', bottom: -28, left: '50%', transform: 'translateX(-50%)',
                    padding: '4px 10px', fontSize: '0.7rem', fontWeight: 800, borderRadius: 12,
                    border: 'none', background: 'linear-gradient(135deg,#d46a6a,#b85c5c)', color: '#fff',
                    cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 3px 10px rgba(212,106,106,0.4)',
                  }}
                >
                  Hug {p.name}
                </button>
              )}
            </div>
          );
        })}

        {/* controls hint */}
        <div style={{
          position: 'absolute', bottom: 8, left: 12, background: 'rgba(255,255,255,0.75)',
          padding: '4px 10px', borderRadius: 10, fontSize: '0.7rem', color: '#8a6d4b', fontWeight: 600,
        }}>
          WASD / Arrows or click to walk · approach someone to hug
        </div>
      </div>

      {/* PEOPLE LIST */}
      <div style={{
        flex: '0 0 240px', background: '#fff8f0', borderRadius: '1.5rem', padding: '1.25rem',
        border: '2px solid #f5d0a9', boxShadow: '0 8px 30px rgba(212,106,106,0.1)',
      }}>
        <h3 style={{ color: '#c47a4a', margin: '0 0 0.9rem', fontSize: '1.05rem' }}>
          👥 People in room ({players.length})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: 300, overflowY: 'auto' }}>
          {players.map(p => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              background: p.isSelf ? '#fff0e6' : '#fff', borderRadius: 12, padding: '0.5rem',
              border: p.isSelf ? '2px solid #d46a6a' : '1px solid #f5d0a9',
            }}>
              <div style={{ transform: 'scale(0.42)', transformOrigin: 'center', width: 96, height: 130, flex: '0 0 42px', overflow: 'hidden' }}>
                <CharacterSprite character={p.character} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 700, color: '#5a3d2b', fontSize: '0.85rem' }}>
                  {p.name}{p.isSelf ? ' (you)' : p.isNpc ? ' · NPC' : ''}
                </p>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#a07850' }}>
                  {p.character.outfitType} · {p.character.accessory !== 'none' ? p.character.accessory : 'plain'}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label style={{ fontSize: '0.7rem', color: '#8a6d4b', fontWeight: 700 }}>Hug type</label>
          <select value={selectedHug} onChange={e => setSelectedHug(e.target.value)} style={{
            width: '100%', marginTop: 4, padding: '0.4rem', borderRadius: 10, border: '2px solid #f5d0a9',
            background: '#fff', fontSize: '0.8rem', color: '#5a3d2b',
          }}>
            {HUG_TYPES.map(h => <option key={h.id} value={h.id}>{h.label}</option>)}
          </select>
          <input
            value={hugMsg}
            onChange={e => setHugMsg(e.target.value)}
            placeholder="Add a message..."
            style={{
              width: '100%', marginTop: 8, padding: '0.4rem', borderRadius: 10,
              border: '2px solid #f5d0a9', fontSize: '0.8rem',
            }}
          />
        </div>
      </div>
    </div>
  );
}
