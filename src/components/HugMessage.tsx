"use client";
import { useState, useEffect } from 'react';

export default function HugMessage({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const timer = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 300); }, 3000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed', top: '24%', left: '50%', transform: `translate(-50%, ${visible ? '0' : '-20px'})`,
        background: 'linear-gradient(160deg,#e0537a,#c73a63)', color: '#fff',
        padding: '1rem 1.6rem', borderRadius: 16, fontSize: '1.05rem', fontWeight: 800,
        boxShadow: '0 10px 34px rgba(224,83,122,.5)', zIndex: 200,
        opacity: visible ? 1 : 0, transition: 'all .3s ease-out', pointerEvents: 'none',
        letterSpacing: '.02em',
        border: '1px solid rgba(255,255,255,.3)',
      }}
    >
      {message}
    </div>
  );
}
