"use client";
import { useState, useEffect } from 'react';
import { useSocket } from '@/lib/use-socket';
import { HUG_TYPES } from '@/lib/hug-types';
import { playHugSound } from '@/lib/sounds';

export default function LiveHugRoom() {
  const { socket, connected } = useSocket();
  const [roomId, setRoomId] = useState('cozy-room');
  const [customMsg, setCustomMsg] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [selectedHug, setSelectedHug] = useState('bear-hug');
  const [joined, setJoined] = useState(false);
  const [roomNumber, setRoomNumber] = useState('');

  // Generate a visible room number when joining
  useEffect(() => {
    if (joined && roomId) {
      setRoomNumber(`ROOM #${roomId.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6).padEnd(3, '0')}`);
    }
  }, [joined, roomId]);

  useEffect(() => {
    if (!socket) return;
    const handleReceive = (data: { from: string; hugType: string; message?: string }) => {
      const hug = HUG_TYPES.find(h => h.id === data.hugType);
      const label = hug ? hug.label : data.hugType;
      const msg = `💌 Someone sent you a ${label} hug!` + (data.message ? ` "${data.message}"` : '');
      setMessages(prev => [...prev.slice(-9), msg]);
      playHugSound(hug?.soundNote || 'C', hug?.durationMs || 2000, hug?.intensity || 3);
    };
    socket.on('receive-hug', handleReceive);
    return () => { socket.off('receive-hug', handleReceive); };
  }, [socket]);

  const joinRoom = () => {
    if (socket && roomId.trim()) {
      socket.emit('join-room', roomId.trim());
      setJoined(true);
      setMessages(prev => [...prev.slice(-9), `✨ You joined room "${roomId.trim()}"`]);
    }
  };

  const sendHug = () => {
    if (socket && roomId.trim() && joined) {
      socket.emit('send-hug', {
        to: roomId.trim(),
        hugType: selectedHug,
        message: customMsg.trim() || 'Virtual hug from the simulator!',
      });
      setMessages(prev => [...prev.slice(-9), `💝 You sent a ${HUG_TYPES.find(h => h.id === selectedHug)?.label} hug!`]);
      setCustomMsg('');
    }
  };

  const generateRoom = () => {
    const names = ['cozy', 'warm', 'soft', 'gentle', 'sweet', 'calm', 'peaceful', 'sunny', 'honey', 'rose', 'lilac', 'moss'];
    const num = Math.floor(Math.random() * 999) + 1;
    const name = names[Math.floor(Math.random() * names.length)];
    setRoomId(`${name}-${num}`);
  };

  return (
    <div style={{
      background: 'linear-gradient(170deg, #fff5eb 0%, #fff0e6 50%, #ffe4d6 100%)',
      borderRadius: '2.5rem', padding: '2.5rem',
      maxWidth: '640px', margin: '2rem auto',
      boxShadow: '0 12px 50px rgba(212,106,106,0.15), 0 2px 8px rgba(0,0,0,0.04)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: '#f5d0a9', opacity: 0.2 }} />
      <div style={{ position: 'absolute', bottom: -20, left: -20, width: 100, height: 100, borderRadius: '50%', background: '#ffe4c4', opacity: 0.3 }} />

      <h2 style={{ color: '#c47a4a', fontSize: '2.2rem', textAlign: 'center', marginBottom: '0.25rem', letterSpacing: '0.02em' }}>
        🌸 Live Hug Room
      </h2>
      <p style={{ textAlign: 'center', color: '#a07850', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
        Real-time hugs with people around the world
      </p>

      {/* Connection status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: connected ? '#6a8a5a' : '#c47a4a', boxShadow: `0 0 8px ${connected ? '#6a8a5a88' : '#c47a4a88'}` }} />
        <span style={{ color: '#8a6d4b', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.03em' }}>
          {connected ? 'ONLINE • LIVE' : 'OFFLINE'}
        </span>
      </div>

      {/* ROOM NUMBER - the "room no thingy" */}
      <div style={{
        background: 'linear-gradient(135deg, #d46a6a, #c47a4a)',
        borderRadius: '1.25rem', padding: '1.25rem', marginBottom: '1.5rem',
        color: '#fff', textAlign: 'center', boxShadow: '0 6px 25px rgba(212,106,106,0.25)',
      }}>
        <p style={{ fontSize: '0.7rem', opacity: 0.9, letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>Your Room Number</p>
        <div style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '0.08em', marginTop: '0.25rem' }}>
          {roomNumber || '—'}
        </div>
        <p style={{ fontSize: '0.75rem', opacity: 0.85, margin: '0.5rem 0 0', fontStyle: 'italic' }}>
          Room: "{roomId.trim() || '—'}"
        </p>
      </div>

      {/* Room input & generate */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
        <input
          type="text"
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
          placeholder="Enter a cozy room name..."
          style={{ flex: 1, padding: '0.7rem 1rem', borderRadius: '1rem', border: '2px solid #f5d0a9', background: '#fff', fontSize: '0.95rem', color: '#5a3d2b', outline: 'none', transition: 'border-color 0.2s' }}
        />
        <button onClick={generateRoom} title="Generate random room" style={{ padding: '0.7rem 1rem', borderRadius: '1rem', border: 'none', background: '#c47a4a', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.85rem' }}>
          🎲
        </button>
      </div>
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <button onClick={joinRoom} disabled={joined} style={{
          padding: '0.65rem 1.5rem', borderRadius: '2rem', border: 'none',
          background: joined ? '#8a6d4b' : 'linear-gradient(135deg, #d46a6a, #b85c5c)',
          color: '#fff', fontWeight: 'bold', cursor: joined ? 'default' : 'pointer',
          boxShadow: '0 4px 15px rgba(212,106,106,0.25)', transition: 'all 0.2s',
          opacity: joined ? 0.7 : 1,
        }}>
          {joined ? '✓ Joined Room' : 'Join Room'}
        </button>
      </div>

      {/* Custom message */}
      <textarea
        value={customMsg}
        onChange={e => setCustomMsg(e.target.value)}
        placeholder="Write a cozy message with your hug..."
        rows={2}
        style={{
          width: '100%', padding: '0.75rem 1rem', borderRadius: '1rem',
          border: '2px solid #f5d0a9', background: '#fff', fontSize: '0.9rem',
          color: '#5a3d2b', outline: 'none', resize: 'vertical', marginBottom: '1rem',
          fontFamily: 'inherit',
        }}
      />

      {/* Hug buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center', marginBottom: '1rem' }}>
        {HUG_TYPES.map(ht => (
          <button key={ht.id} onClick={() => setSelectedHug(ht.id)} style={{
            padding: '0.45rem 0.75rem', borderRadius: '0.75rem', fontSize: '0.75rem',
            border: selectedHug === ht.id ? '2px solid #d46a6a' : '2px solid #f5d0a9',
            background: selectedHug === ht.id ? '#fff5eb' : '#fff', color: selectedHug === ht.id ? '#d46a6a' : '#8a6d4b',
            cursor: 'pointer', fontWeight: 700, transition: 'all 0.15s',
          }}>
            {ht.label}
          </button>
        ))}
      </div>

      {/* Send */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <button onClick={sendHug} disabled={!joined || !connected} style={{
          padding: '0.85rem 2.2rem', borderRadius: '2.5rem', border: 'none',
          background: (!joined || !connected) ? '#ccc' : 'linear-gradient(135deg, #d46a6a 0%, #b85c5c 100%)',
          color: '#fff', fontWeight: 800, fontSize: '1.05rem', cursor: (!joined || !connected) ? 'not-allowed' : 'pointer',
          boxShadow: (!joined || !connected) ? 'none' : '0 4px 20px rgba(212,106,106,0.35)',
          letterSpacing: '0.02em',
        }}>
          💝 Send Hug
        </button>
      </div>

      {/* Message log */}
      <div style={{
        background: '#fff', borderRadius: '1.25rem', padding: '1rem',
        maxHeight: '220px', overflowY: 'auto', border: '2px solid #f5d0a9',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.02)',
      }}>
        {messages.length === 0 && (
          <p style={{ color: '#c4a484', textAlign: 'center', fontSize: '0.85rem', margin: '0.5rem 0', fontStyle: 'italic' }}>
            No hugs yet. Join a room and send some warmth!
          </p>
        )}
        {messages.map((msg, i) => (
          <p key={i} style={{ margin: '0.3rem 0', fontSize: '0.85rem', color: '#5a3d2b', padding: '0.35rem 0.5rem', borderRadius: '0.5rem', background: i % 2 === 0 ? '#fff8f0' : '#fff5eb' }}>
            {msg}
          </p>
        ))}
      </div>
    </div>
  );
}
