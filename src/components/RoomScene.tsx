"use client";
import { useEffect, useRef, useState, useCallback } from 'react';
import CharacterSprite from './CharacterSprite';
import { Character } from '@/types';
import { useSocket } from '@/lib/use-socket';
import { playHugSound } from '@/lib/sounds';
import { USER_ID } from '@/lib/socket-config';

interface RoomPlayer {
  id: string;
  userId: string;
  name: string;
  gender: string;
  character: Character;
  x: number;
  y: number;
  isSelf?: boolean;
  walking?: boolean;
  hugUntil?: number;
}

interface HugPair {
  me: RoomPlayer;
  them: RoomPlayer;
  x: number;
  y: number;
  since: number;
}

interface RoomInfo {
  id: string;
  name: string;
  playerCount: number;
  onlineCount: number;
}

const ROOM_W = 100;

export default function RoomScene({ myCharacter, roomId: initialRoomId, joined: initialJoined }: { myCharacter: Character; roomId?: string; joined?: boolean }) {
  const { socket, connected } = useSocket();
  const roomRef = useRef<HTMLDivElement>(null);
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [roomsList, setRoomsList] = useState<RoomInfo[]>([]);
  const [hugPair, setHugPair] = useState<HugPair | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [roomInput, setRoomInput] = useState(initialRoomId || 'cozy-living-room');
  const [joined, setJoined] = useState(!!initialJoined);
  const keys = useRef<{ [k: string]: boolean }>({});

  // Self always present
  useEffect(() => {
    setPlayers(prev => {
      const others = prev.filter(p => !p.isSelf);
      return [{ id: 'me', userId: USER_ID, name: myCharacter.name || 'You', gender: myCharacter.gender, character: myCharacter, x: 50, y: 60, isSelf: true }, ...others];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPlayers(prev => prev.map(p => (p.isSelf ? { ...p, name: myCharacter.name || 'You', character: myCharacter, gender: myCharacter.gender } : p)));
  }, [myCharacter]);

  // Socket events
  useEffect(() => {
    if (!socket) return;

    const onRooms = (rooms: any) => {
      const list: RoomInfo[] = (Object.values(rooms || {}) as any[]).filter((r: any) => r && r.playerCount >= 0);
      setRoomsList(list);
    };

    const onPlayers = (dict: any) => {
      const list = Object.values(dict || {}).map((p: any) => ({ id: p.id, userId: p.userId, name: p.name, gender: p.character?.gender, character: p.character, x: p.x, y: p.y }));
      setPlayers(prev => {
        const self = prev.find(p => p.isSelf);
        return self ? [self, ...list.filter(p => p.userId !== self.userId)] : list;
      });
    };

    const onMoved = (d: any) => setPlayers(prev => prev.map(p => (p.userId === d.userId ? { ...p, x: d.x, y: d.y, walking: true } : p)));

    const onLeft = (userId: string) => setPlayers(prev => prev.filter(p => p.userId !== userId));

    const onReceive = (d: any) => {
      playHugSound('G', 1400, 0.4);
      setPlayers(prev => prev.map(p => (p.userId === d.from || p.id === d.from ? { ...p, hugUntil: Date.now() + 3000 } : p)));
      setLog(l => [...l.slice(-7), `💝 ${d.fromName || 'Someone'} hugged you${d.message ? `: "${d.message}"` : ''}`]);
    };

    socket.on('rooms-list', onRooms);
    socket.on('players-update', onPlayers);
    socket.on('player-moved', onMoved);
    socket.on('player-left', onLeft);
    socket.on('receive-hug', onReceive);

    socket.emit('get-rooms');
    return () => {
      socket.off('rooms-list', onRooms);
      socket.off('players-update', onPlayers);
      socket.off('player-moved', onMoved);
      socket.off('player-left', onLeft);
      socket.off('receive-hug', onReceive);
    };
  }, [socket, connected, myCharacter]);

  // Auto join when joined=true
  useEffect(() => {
    if (!joined || !socket || !connected) return;
    socket.emit('join-room', { room: roomInput, player: { name: myCharacter.name || 'You', character: myCharacter, userId: USER_ID } });
    setJoined(true);
  }, [joined, socket, connected, roomInput, myCharacter]);

  // Keyboard movement
  useEffect(() => {
    const down = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true; };
    const up = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  // Loop
  useEffect(() => {
    let raf = 0;
    const step = () => {
      setPlayers(prev => {
        const next = prev.map(p => ({ ...p }));
        const self = next.find(p => p.isSelf && !p.hugUntil);
        if (self) {
          let dx = 0, dy = 0;
          const k = keys.current;
          if (k['arrowleft'] || k['a']) dx -= 1;
          if (k['arrowright'] || k['d']) dx += 1;
          if (k['arrowup'] || k['w']) dy -= 1;
          if (k['arrowdown'] || k['s']) dy += 1;
          const moving = dx !== 0 || dy !== 0;
          self.x = Math.max(8, Math.min(92, self.x + dx * 0.6));
          self.y = Math.max(30, Math.min(90, self.y + dy * 0.6));
          self.walking = moving;
        }
        next.forEach(p => { if (p.hugUntil && Date.now() > p.hugUntil) p.hugUntil = undefined; });
        return next;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Broadcast position
  useEffect(() => {
    const t = setInterval(() => {
      const self = players.find(p => p.isSelf && !p.hugUntil);
      if (self && socket && connected && joined) socket.emit('move', { room: roomInput, x: self.x, y: self.y });
    }, 120);
    return () => clearInterval(t);
  }, [players, socket, connected, roomInput, joined]);

  const moveTo = (e: React.MouseEvent) => {
    const rect = roomRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(30, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));
    setPlayers(prev => prev.map(p => (p.isSelf ? { ...p, x, y } : p)));
  };

  const hug = useCallback((target: RoomPlayer) => {
    const self = players.find(p => p.isSelf && !p.hugUntil);
    if (!self || target.hugUntil) return;
    playHugSound('G', 1400, 0.4);
    const mx = (self.x + target.x) / 2;
    const my = (self.y + target.y) / 2 - 8;
    setPlayers(prev => prev.map(p => (p.userId === self.userId || p.userId === target.userId ? { ...p, hugUntil: Date.now() + 3000 } : p)));
    setHugPair({ me: self, them: target, x: mx, y: my, since: Date.now() });
    setLog(l => [...l.slice(-7), `💝 You hugged ${target.name}`]);
    if (socket && connected) socket.emit('send-hug', { room: roomInput, to: target.userId, variant: 'human', message: '', fromName: myCharacter.name || 'You' });
  }, [socket, connected, roomInput, players, myCharacter.name]);

  const joinRoom = (roomName: string) => {
    if (!socket || !connected) return;
    socket.emit('join-room', { room: roomName, player: { name: myCharacter.name || 'You', character: myCharacter, userId: USER_ID } });
    setRoomInput(roomName);
    setJoined(true);
  };

  const self = players.find(p => p.isSelf);
  const huggingPair = hugPair ? players.filter(p => p.userId === hugPair.me.userId || p.userId === hugPair.them.userId) : [];
  const hx = huggingPair.length === 2 ? (huggingPair[0].x + huggingPair[1].x) / 2 : null;
  const hy = huggingPair.length === 2 ? (huggingPair[0].y + huggingPair[1].y) / 2 : null;
  const hugAge = hugPair ? Date.now() - hugPair.since : 9999;
  const sway = Math.sin(Date.now() / 140) * 4;
  const bob = Math.abs(Math.sin(Date.now() / 100)) * 3;

  return (
    <>
      <style>{`
        @keyframes hugSway { 0%,100%{transform:translate(-50%,-100%) rotate(0deg)} 50%{transform:translate(-50%,-100%) rotate(2.5deg) translateY(-3px)} }
        @keyframes heartUp { 0%{opacity:0;transform:translateY(0) scale(.7)} 30%{opacity:1} 100%{opacity:0;transform:translateY(-80px) scale(1.4)} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 0 0 rgba(255,143,163,.45)} 50%{box-shadow:0 0 0 26px rgba(255,143,163,0)} }
      `}</style>

      {/* ROOM HEADER */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.5rem', background: 'rgba(20,16,24,.6)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255,255,255,.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h3 style={{ margin: 0, color: '#ffb9c9', fontWeight: 800, fontSize: '1.1rem' }}>🏠 Room</h3>
          <span style={{
            padding: '2px 10px', borderRadius: 999,
            background: connected && joined ? 'rgba(110,231,168,.2)' : connected ? 'rgba(255,214,170,.2)' : 'rgba(255,143,163,.2)',
            border: '1px solid ' + (connected && joined ? 'rgba(110,231,168,.4)' : connected ? 'rgba(255,214,170,.4)' : 'rgba(255,143,163,.4)'),
            color: connected && joined ? '#8ceaaa' : connected ? '#ffd9a0' : '#ff8fa3',
            fontSize: '.65rem', fontWeight: 800, textTransform: 'uppercase',
          }}>
            {joined && connected ? 'LIVE IN ROOM' : joined ? 'JOINING...' : connected ? 'OFFLINE' : 'DISCONNECTED'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '.7rem', color: 'rgba(245,235,230,.4)' }}>Room:</span>
          <input
            value={roomInput}
            onChange={e => setRoomInput(e.target.value)}
            style={{
              width: 140, padding: '.4rem .7rem', borderRadius: 10, border: '1px solid rgba(255,255,255,.1)',
              background: 'rgba(255,255,255,.05)', color: '#f5ebe6', fontSize: '.8rem', outline: 'none', fontFamily: 'inherit',
            }}
          />
          <button
            onClick={() => joinRoom(roomInput)}
            disabled={!socket || !connected || joined}
            style={{
              padding: '.4rem 1rem', borderRadius: 10, border: 'none', cursor: joined || !connected ? 'default' : 'pointer',
              background: joined || !connected ? 'rgba(255,255,255,.15)' : 'linear-gradient(160deg,#e0537a,#c73a63)',
              color: joined || !connected ? 'rgba(245,235,230,.4)' : '#fff',
              fontSize: '.75rem', fontWeight: 800,
            }}
          >
            {joined ? 'Joined' : !connected ? 'Offline' : 'Join'}
          </button>
        </div>
      </header>

      {/* ROOM */}
      <div
        ref={roomRef}
        onClick={moveTo}
        style={{
          position: 'relative', flex: '1 1 520px', minWidth: 320, maxWidth: 720, height: 470,
          borderRadius: 26, overflow: 'hidden', cursor: 'crosshair',
          background: 'radial-gradient(ellipse at 50% 108%, rgba(255,143,163,.14), transparent 60%), linear-gradient(180deg, #1e1922 0%, #29202f 62%, #362738 100%)',
          border: '1px solid rgba(255,255,255,.09)',
          boxShadow: '0 30px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.07)',
        }}
      >
        <div style={{
          position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
          width: 320, height: 190, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,214,170,.20), transparent 70%)', filter: 'blur(9px)',
        }} />
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} style={{
            position: 'absolute', top: 16 + i * 2, left: `${10 + i * 14}%`, width: 8, height: 8,
            borderRadius: '50%', background: '#ffd9a0', boxShadow: '0 0 10px 2px rgba(255,214,170,.55)',
            animation: `pulseGlow ${2.4 + i * 0.25}s ease-in-out infinite`,
          }} />
        ))}
        <div style={{
          position: 'absolute', bottom: 4, left: '14%', width: '72%', height: 88,
          background: 'radial-gradient(ellipse at center, rgba(224,83,122,.18), rgba(90,122,224,.09) 60%, transparent 72%)',
          borderRadius: '50%', border: '1px solid rgba(255,255,255,.05)',
        }} />

        {/* human hug composite */}
        {huggingPair.length === 2 && hugAge < 3000 && hx != null && hy != null && (
          <div style={{
            position: 'absolute', left: `${hx}%`, top: `${hy - 10}%`,
            transform: `translate(-50%,-100%) rotate(${sway}deg)`,
            zIndex: 999,
          }}>
            {/* glow */}
            <div style={{
              position: 'absolute', top: 62, left: '50%', transform: 'translateX(-50%)',
              width: 150, height: 100, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,143,163,.25), transparent 60%)', filter: 'blur(14px)',
              animation: 'pulseGlow 2s ease-in-out infinite',
              zIndex: 0,
            }} />

            {/* me (left) - arm around them */}
            <div style={{ position: 'relative', transform: `translateY(${bob}px)` }}>
              <CharacterSprite character={huggingPair[0].character} walking={false} flip={false} />
              <div style={{ position: 'absolute', top: 48, left: -6, width: 34, height: 56, background: 'linear-gradient(160deg,#5a3d2b,#3e2b1e)', borderRadius: '18px 0 0 18px', border: '1px solid rgba(255,255,255,.14)', boxShadow: 'inset 0 -6px 12px rgba(0,0,0,.35), 0 2px 6px rgba(0,0,0,.2)' }} />
              <div style={{ position: 'absolute', top: 72, left: 28, width: 28, height: 20, background: 'linear-gradient(90deg,#3e2b1e,#5a3d2b)', borderRadius: '12px 0 0 12px', border: '1px solid rgba(255,255,255,.12)' }} />
            </div>

            {/* them (right) - arm around me */}
            <div style={{ position: 'relative', transform: `scaleX(-1) translateY(${bob}px)` }}>
              <CharacterSprite character={huggingPair[1].character} walking={false} flip={true} />
              <div style={{ position: 'absolute', top: 48, left: -6, width: 34, height: 56, background: 'linear-gradient(-160deg,#5a3d2b,#3e2b1e)', borderRadius: '0 18px 18px 0', border: '1px solid rgba(255,255,255,.14)', boxShadow: 'inset 0 -6px 12px rgba(0,0,0,.35)' }} />
              <div style={{ position: 'absolute', top: 72, right: 28, width: 28, height: 20, background: 'linear-gradient(-90deg,#3e2b1e,#5a3d2b)', borderRadius: '0 12px 12px 0', border: '1px solid rgba(255,255,255,.12)' }} />
            </div>

            <div style={{ position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)',
              width: 38, height: 38, background: 'rgba(255,143,163,.30)', borderRadius: '50%', filter: 'blur(9px)', zIndex: 0 }} />
            {hugAge > 500 && (
              <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: '1.5rem', animation: 'heartUp 1.3s ease-out infinite' }}>💖</div>
            )}
          </div>
        )}

        {/* normal players */}
        {players.map(p => {
          if (huggingPair.some(q => q.id === p.id)) return null;
          const d = self ? Math.hypot(((p.x - self.x) / ROOM_W) * 560, ((p.y - self.y) / ROOM_W) * 470) : 999;
          const canHug = !p.isSelf && !p.hugUntil && d < 115;
          return (
            <div key={p.id} style={{
              position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
              transform: 'translate(-50%,-100%)', transition: 'left .08s linear, top .08s linear',
              zIndex: Math.round(200 - p.y),
            }}>
              <div style={{
                position: 'absolute', top: -26, left: '50%', transform: 'translateX(-50%)',
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'rgba(20,16,24,.72)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,.12)',
                padding: '3px 9px', borderRadius: 999, whiteSpace: 'nowrap',
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: p.isSelf ? '#ff8fa3' : (connected ? '#6ee7a8' : 'rgba(255,255,255,.3)'),
                  boxShadow: p.isSelf ? '0 0 8px #ff8fa3' : (connected ? '0 0 8px #6ee7a8' : 'none'),
                }} />
                <span style={{ fontSize: '.68rem', fontWeight: 700, letterSpacing: '.02em' }}>
                  {p.name}{p.isSelf ? ' (you)' : ''}
                </span>
                <span style={{ fontSize: '.6rem', opacity: .5 }}>{p.gender === 'female' ? '♀' : p.gender === 'male' ? '♂' : '⚧'}</span>
              </div>

              <CharacterSprite character={p.character} walking={p.walking && !p.hugUntil} flip={self ? p.x < self.x : false} />

              {canHug && (
                <button
                  onClick={e => { e.stopPropagation(); hug(p); }}
                  style={{
                    position: 'absolute', bottom: -30, left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '5px 12px', borderRadius: 999, fontSize: '.7rem', fontWeight: 800,
                    border: '1px solid rgba(255,143,163,.6)',
                    background: 'linear-gradient(160deg, rgba(224,83,122,.92), rgba(200,60,90,.92))',
                    color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap',
                    boxShadow: '0 6px 18px rgba(224,83,122,.45)', backdropFilter: 'blur(6px)',
                  }}
                >
                  💝 Hug {p.name}
                </button>
              )}
            </div>
          );
        })}

        <div style={{
          position: 'absolute', bottom: 10, left: 14, display: 'flex', alignItems: 'center', gap: 6,
          background: 'rgba(20,16,24,.6)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,.08)', padding: '4px 10px', borderRadius: 999,
          fontSize: '.66rem', color: 'rgba(245,235,230,.6)', fontWeight: 600,
        }}>
          ⌨️ WASD / arrows or click to move · walk up to someone to hug
        </div>

        {!connected && (
          <div style={{
            position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(224,83,122,.16)', border: '1px solid rgba(255,143,163,.35)',
            color: '#ffd9e1', padding: '5px 14px', borderRadius: 999,
            fontSize: '.68rem', fontWeight: 700, backdropFilter: 'blur(8px)',
          }}>
            Offline — start local server + tunnel to see others
          </div>
        )}
      </div>

      {/* PEOPLE LIST + ROOM LIST */}
      <aside style={{
        flex: '0 0 260px', background: 'linear-gradient(165deg, rgba(255,255,255,.06), rgba(255,255,255,.02))',
        border: '1px solid rgba(255,255,255,.09)', borderRadius: 26,
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 24px 60px rgba(0,0,0,.45)',
        padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '.9rem',
      }}>
        {/* Open Rooms List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.6rem' }}>
            <h4 style={{ margin: 0, color: '#ffb9c9', fontSize: '.85rem', fontWeight: 800 }}>Open Rooms</h4>
            <button
              onClick={() => socket?.emit('get-rooms')}
              style={{
                padding: '2px 8px', borderRadius: 8, border: 'none', background: 'rgba(255,255,255,.08)',
                color: '#fff', fontSize: '.65rem', fontWeight: 700, cursor: 'pointer',
              }}
            >Refresh</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.35rem', maxHeight: 200, overflowY: 'auto' }}>
            {roomsList.length === 0 && (
              <p style={{ fontSize: '.7rem', color: 'rgba(245,235,230,.35)', textAlign: 'center' }}>No rooms yet</p>
            )}
            {roomsList.map(r => (
              <button
                key={r.id}
                onClick={() => { setRoomInput(r.id); joinRoom(r.id); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '.5rem .7rem', borderRadius: 10, cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,.08)',
                  background: roomInput === r.id ? 'rgba(224,83,122,.2)' : 'rgba(255,255,255,.03)',
                  transition: 'all .15s',
                }}
              >
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '.75rem', fontWeight: 700, color: '#f5ebe6' }}>{r.id}</span>
                  <span style={{ fontSize: '.62rem', color: 'rgba(245,235,230,.4)', marginLeft: 6 }}>{r.playerCount} person{r.playerCount === 1 ? '' : 's'}</span>
                </div>
                <span style={{ fontSize: '.7rem', color: '#ffb9c9', fontWeight: 800 }}>{r.playerCount}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Current Room Players */}
        <div>
          <h4 style={{ margin: 0, color: '#ffb9c9', fontSize: '.85rem', fontWeight: 800 }}>People in room</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.45rem', maxHeight: 180, overflowY: 'auto' }}>
            {players.filter(p => !p.isSelf).length === 0 ? (
              <p style={{ fontSize: '.7rem', color: 'rgba(245,235,230,.4)', textAlign: 'center', padding: '.8rem 0' }}>
                No one else here yet. Share the room name!
              </p>
            ) : (
              players.map(p => (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: '.6rem',
                  background: p.isSelf ? 'linear-gradient(160deg,rgba(224,83,122,.20),rgba(224,83,122,.05))' : 'rgba(255,255,255,.03)',
                  border: p.isSelf ? '1px solid rgba(255,143,163,.4)' : '1px solid rgba(255,255,255,.06)',
                  borderRadius: 14, padding: '.5rem .6rem',
                }}>
                  <div style={{ width: 40, height: 52, flex: '0 0 40px', overflow: 'visible', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <div style={{ transform: 'scale(.38)', transformOrigin: 'bottom center', width: 110, height: 168 }} >
                      <CharacterSprite character={p.character} />
                    </div>
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: p.isSelf ? '#ff8fa3' : (connected ? '#6ee7a8' : 'rgba(255,255,255,.25)'),
                      }} />
                      {p.name}{p.isSelf && <span style={{ opacity: .5, fontSize: '.68rem' }}>you</span>}
                    </p>
                    <p style={{ margin: '.15rem 0 0', fontSize: '.66rem', color: 'rgba(245,235,230,.45)', textTransform: 'capitalize' }}>
                      {p.gender === 'nonbinary' ? 'nb' : p.gender} · {p.character.outfitType} · {p.character.accessory !== 'none' ? p.character.accessory : 'plain'}
                    </p>
                  </div>
                  {p.hugUntil && <span style={{ fontSize: '.9rem' }}>💝</span>}
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,.22)', borderRadius: 14, padding: '.7rem', minHeight: 64, maxHeight: 110, overflowY: 'auto' }}>
          {log.length === 0 && <p style={{ margin: 0, fontSize: '.68rem', color: 'rgba(245,235,230,.35)' }}>Hug activity appears here…</p>}
          {log.map((l, i) => <p key={i} style={{ margin: '.25rem 0', fontSize: '.68rem', color: 'rgba(245,235,230,.75)' }}>{l}</p>)}
        </div>
      </aside>
    </>
  );
}
