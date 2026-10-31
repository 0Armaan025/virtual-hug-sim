"use client";
import { useState, useEffect } from 'react';

export default function HugMessage({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!message) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed', top: '20%', left: '50%', transform: `translate(-50%, ${visible ? '0' : '-20px'})`,
        background: 'linear-gradient(135deg, #d46a6a, #b85c5c)', color: '#fff',
        padding: '1.2rem 2rem', borderRadius: '2rem', fontSize: '1.2rem', fontWeight: 'bold',
        boxShadow: '0 8px 30px rgba(212,106,106,0.4)', zIndex: 200,
        opacity: visible ? 1 : 0, transition: 'all 0.3s ease-out', pointerEvents: 'none',
      }}
    >
      {message}
    </div>
  );
}
