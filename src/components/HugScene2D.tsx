"use client";
import { useState } from 'react';
import HugAnimation from './HugAnimation';
import { HUG_ANIMATIONS } from '@/lib/animations';

const hugTypes = Object.keys(HUG_ANIMATIONS).map(id => ({
  id,
  label: id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
}));

export default function HugScene2D() {
  const [selectedHug, setSelectedHug] = useState('bear-hug');
  const [hugActive, setHugActive] = useState(false);

  const triggerHug = () => {
    setHugActive(true);
    setTimeout(() => setHugActive(false), (HUG_ANIMATIONS[selectedHug]?.duration || 2000) + 500);
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #fff5eb 0%, #ffebd6 100%)',
      borderRadius: '2rem',
      padding: '2rem',
      boxShadow: '0 8px 40px rgba(212,106,106,0.15)',
      maxWidth: '700px',
      margin: '2rem auto',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decor */}
      <div style={{
        position: 'absolute', top: 20, left: 30, width: 60, height: 60,
        background: '#f5d0a9', borderRadius: '50%', opacity: 0.3,
      }} />
      <div style={{
        position: 'absolute', bottom: 30, right: 20, width: 40, height: 40,
        background: '#f5d0a9', borderRadius: '50%', opacity: 0.3,
      }} />

      <h2 style={{ color: '#d46a6a', fontSize: '2rem', textAlign: 'center', marginBottom: '0.5rem' }}>
        2D Hug Scene
      </h2>
      <p style={{ textAlign: 'center', color: '#8a6d4b', marginBottom: '1.5rem' }}>
        Pick a hug type and press the button
      </p>

      {/* Hug buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
        {hugTypes.map(ht => (
          <button
            key={ht.id}
            onClick={() => { setSelectedHug(ht.id); setHugActive(false); }}
            style={{
              padding: '0.5rem 1rem', borderRadius: '1rem', border: '2px solid',
              borderColor: selectedHug === ht.id ? '#d46a6a' : '#f5d0a9',
              background: selectedHug === ht.id ? '#fff5eb' : '#fff',
              color: '#8a6d4b', fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.2s', fontSize: '0.85rem',
            }}
          >
            {ht.label}
          </button>
        ))}
      </div>

      {/* Animation */}
      <HugAnimation hugType={selectedHug} active={hugActive} />

      {/* Trigger */}
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <button
          onClick={triggerHug}
          style={{
            padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '2rem',
            border: 'none', background: 'linear-gradient(135deg, #d46a6a 0%, #b85c5c 100%)',
            color: '#fff', fontWeight: 'bold', cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(212,106,106,0.3)',
            transition: 'transform 0.1s',
          }}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          Send {hugTypes.find(h => h.id === selectedHug)?.label} Hug
        </button>
      </div>
    </div>
  );
}
