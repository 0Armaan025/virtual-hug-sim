"use client";
import { useEffect, useRef, useState, useCallback } from 'react';
import CharacterSprite from './CharacterSprite';
import { Character, HUG_VARIANTS } from '@/types';
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
  variant: string;
  x: number;
  y: number;
  since: number;
}

const ROOM_W = 100;

export default function RoomScene({ myCharacter, roomId }: { myCharacter: Character; roomId: string }) {
  const { socket, connected } = useSocket();
  const roomRef = useRef<HTMLDivElement>(null);
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [hugPair, setHugPair] = useState<HugPair | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const keys = useRef<{ [k: string]: boolean }>({});

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

  useEffect(() => {
    if (!socket) return;
    const join = () => socket.emit('join-room', { room: roomId, player: { name: myCharacter.name || 'You', character: myCharacter, userId: USER_ID } });
    if (connected) join();

    const onUpdate = (dict: any) => {
      const list = Object.values(dict || {}).map((p: any) => ({ id: p.id, userId: p.userId, name: p.name, gender: p.character?.gender, character: p.character, x: p.x, y: p.y }));
      setPlayers(prev => {
        const self = prev.find(p => p.isSelf);
        return self ? [self, ...list.filter(p => p.userId !== self.userId)] : list;
      });
    };
    const onMoved = (d: any) => setPlayers(prev => prev.map(p => (p.userId === d.userId ? { ...p, x: d.x, y: d.y, walking: true } : p)));
    const onLeft = (userId: string) => setPlayers(prev => prev.filter(p => p.userId !== userId));
    const onReceive = (d: any) => {
      playHugSound('G', 1500, 0.4);
      setPlayers(prev => prev.map(p => (p.id === d.from ? { ...p, hugUntil: Date.now() + 2600 } : p)));
      setLog(l => [...l.slice(-7), `💝 ${d.fromName || 'Someone'} hugged you${d.message ? `: "${d.message}"` : ''}`]);
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

  useEffect(() => {
    const down = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true; };
    const up = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, []);

  useEffect(() => {
    let raf = 0;
    const step = () => {
      setPlayers(prev => {
        const next = prev.map(p => ({ ...p }));
        const self = next.find(p => p.isSelf);
        if (self && !self.hugUntil) {
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

  useEffect(() => {
    const t = setInterval(() => {
      const self = players.find(p => p.isSelf);
      if (self && !self.hugUntil && socket && connected) socket.emit('move', { room: roomId, x: self.x, y: self.y });
    }, 120);
    return () => clearInterval(t);
  }, [players, socket, connected, roomId]);

  const moveTo = (e: React.MouseEvent) => {
    const rect = roomRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(8, Math.min(92, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(30, Math.min(90, ((e.clientY - rect.top) / rect.height) * 100));
    setPlayers(prev => prev.map(p => (p.isSelf ? { ...p, x, y } : p)));
  };

  const hug = useCallback((target: RoomPlayer) => {
    const variant = HUG_VARIANTS[Math.floor(Math.random() * HUG_VARIANTS.length)].id;
    playHugSound('G', 1500, 0.4);
    const self = players.find(p => p.isSelf);
    if (!self) return;
    const mx = (self.x + target.x) / 2;
    const my = (self.y + target.y) / 2;
    setPlayers(prev => prev.map(p => (p.id === target.id ? { ...p, hugUntil: Date.now() + 3000 } : p)));
    setHugPair({ me: self, them: target, variant, x: mx, y: my, since: Date.now() });
    setLog(l => [...l.slice(-7), `💝 You hugged ${target.name} (${HUG_VARIANTS.find(v => v.id === variant)?.label})`]);
    if (socket && connected) socket.emit('send-hug', { room: roomId, to: target.userId, variant, message: '', fromName: myCharacter.name || 'You' });
  }, [socket, connected, roomId, players, myCharacter.name]);

  const self = players.find(p => p.isSelf);
  const onlineOthers = players.filter(p => !p.isSelf && !p.hugUntil);

  const renderHugPair = () => {
    if (!hugPair || !self) return null;
    const { me, them, variant, x: hx, y: hy, since } = hugPair;
    const age = Date.now() - since;
    if (age > 3000) return null;
    const sway = Math.sin(Date.now() / 120) * 3;

    return (
      <div style={{ position: 'absolute', left: `${hx}%`, top: `${hy - 10}%`, transform: 'translate(-50%, -100%) rotate(' + sway + 'deg)', zIndex: 999, animation: variant === 'spin' ? 'hugSpin 1.6s linear infinite' : undefined }}>
        <div style={{ position: 'absolute', top: 90, left: -34, width: 62, height: 44, background: 'rgba(0,0,0,.12)', borderRadius: '50% 50% 40% 40%', transform: 'rotate(-12deg)' }} />
        <div style={{ position: 'absolute', top: 90, right: -34, width: 62, height: 44, background: 'rgba(0,0,0,.12)', borderRadius: '50% 50% 40% 40%', transform: 'rotate(12deg)' }} />
        <div style={{ position: 'relative', transform: variant === 'lean' ? 'rotate(-10deg)' : 'none', marginRight: 28 }}>
          <CharacterSprite character={me.character} walking={false} flip={false} />
        </div>
        <div style={{ position: 'relative', transform: variant === 'lean' ? 'rotate(10deg)' : 'none', marginLeft: 28 }}>
          <CharacterSprite character={them.character} walking={false} flip={true} />
        </div>
        <div style={{ position: 'absolute', top: 30, left: '50%', transform: 'translateX(-50%)', width: 44, height: 44, background: 'rgba(255,143,163,.35)', borderRadius: '50%', filter: 'blur(8px)', zIndex: 0, animation: variant === 'squeeze' ? 'hugSqueeze 1.2s ease-in-out infinite' : 'none' }} />
        {variant === 'spin' && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', fontSize: '1.4rem', animation: 'heartUp 1.4s ease-out infinite' }}>💖</div>}
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes hugSqueeze { 0%,100%{transform:translate(-50%,-100%) scale(1)} 30%{transform:translate(-50%,-100%) scale(1.12) translateY(-5px)} 60%{transform:translate(-50%,-100%) scale(.96)} }
        @keyframes hugLean { 0%,100%{transform:translate(-50%,-100%) rotate(0deg)} 50%{transform:translate(-50%,-100%) rotate(-10deg) translateY(-4px)} }
        @keyframes hugSpin { 0%{transform:translate(-50%,-100%) rotate(0deg)} 100%{transform:translate(-50%,-100%) rotate(360deg)} }
        @keyframes heartUp { 0%{opacity:0;transform:translateY(0) scale(.6)} 30%{opacity:1} 100%{opacity:0;transform:translateY(-74px) scale(1.3)} }
      `}</style>

      <div
        ref={roomRef}
        onClick={moveTo}
        style={{
          position: 'relative', flex: '1 1 520px', minWidth: 320, maxWidth: 720, height: 470,
          borderRadius: 26, overflow: 'hidden', cursor: 'crosshair',
          background: 'radial-gradient(ellipse at 50% 108%, rgba(255,143,163,.16), transparent 60%), linear-gradient(180deg, #1e1922 0%, #29202f 62%, #362738 100%)',
          border: '1px solid rgba(255,255,255,.09)',
          boxShadow: '0 30px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.07)',
        }}
      >
        <div style={{
          position: 'absolute', top: -70, left: '50%', transform: 'translateX(-50%)',
          width: 300, height: 180, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,214,170,.22), transparent 70%)', filter: 'blur(8px)',
        }} />
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} style={{
            position: 'absolute', top: 16 + i * 2, left: `${10 + i * 14}%`, width: 8, height: 8,
            borderRadius: '50%', background: '#ffd9a0', boxShadow: '0 0 10px 2px rgba(255,214,170,.55)',
            animation: `pulseGlow ${2.4 + i * 0.25}s ease-in-out infinite`,
          }} />
        ))}
        <div style={{ position: 'absolute', top: 52, right: 36, width: 86, height: 74, borderRadius: 14,
          background: 'linear-gradient(160deg, rgba(120,160,220,.28), rgba(90,122,224,.16))',
          border: '2px solid rgba(255,255,255,.12)' }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, background: 'rgba(255,255,255,.12)' }} />
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: 'rgba(255,255,255,.12)' }} />
        </div>
        <div style={{
          position: 'absolute', bottom: 4, left: '14%', width: '72%', height: 90,
          background: 'radial-gradient(ellipse at center, rgba(224,83,122,.18), rgba(90,122,224,.09) 60%, transparent 72%)',
          borderRadius: '50%', border: '1px solid rgba(255,255,255,.05)',
        }} />

        {hugPair && renderHugPair()}

        {players.map(p => {
          if (hugPair && (p.id === hugPair.me.id || p.id === hugPair.them.id)) return null;
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

      <aside style={{
        flex: '0 0 250px', background: 'linear-gradient(165deg, rgba(255,255,255,.06), rgba(255,255,255,.02))',
        border: '1px solid rgba(255,255,255,.09)', borderRadius: 26,
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 24px 60px rgba(0,0,0,.45)',
        padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '.9rem',
      }}>
        <header>
          <h3 style={{ margin: 0, fontSize: '.95rem', fontWeight: 800, letterSpacing: '-0.01em' }}>In this room</h3>
          <p style={{ margin: '.2rem 0 0', fontSize: '.7rem', color: 'rgba(245,235,230,.45)' }}>
            {players.length} here · {onlineOthers.length} online
          </p>
        </header>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.45rem', maxHeight: 280, overflowY: 'auto' }}>
          {players.map(p => (
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
          ))}
          {players.length === 1 && connected && (
            <p style={{ fontSize: '.7rem', color: 'rgba(245,235,230,.4)', textAlign: 'center', padding: '.8rem 0' }}>
              You're the only one here — share the room name with a friend!
            </p>
          )}
        </div>

        <input
          value=""
          onChange={() => {}}
          placeholder="Message with your hug..."
          style={{
            width: '100%', padding: '.6rem .8rem', borderRadius: 14, fontSize: '.8rem',
            border: '1px solid rgba(255,255,255,.1)', background: 'rgba(255,255,255,.04)',
            color: '#f5ebe6', outline: 'none', fontFamily: 'inherit',
          }}
        />

        <div style={{
          background: 'rgba(0,0,0,.22)', borderRadius: 14, padding: '.7rem',
          minHeight: 64, maxHeight: 110, overflowY: 'auto',
        }}>
          {log.length === 0 && <p style={{ margin: 0, fontSize: '.68rem', color: 'rgba(245,235,230,.35)' }}>Hug activity appears here…</p>}
          {log.map((l, i) => <p key={i} style={{ margin: '.25rem 0', fontSize: '.68rem', color: 'rgba(245,235,230,.75)' }}>{l}</p>)}
        </div>
      </aside>
    </>
  );
}
