"use client";
import { useEffect, useRef, useState } from 'react';
import { getSocket, disconnectSocket } from './socket-client';

export function useSocket() {
  const socketRef = useRef(getSocket());
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = socketRef.current;

    socket.on('connect', () => {
      setConnected(true);
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('Socket disconnected');
    });

    socket.on('connect_error', (err: any) => {
      console.error('Socket connection error:', err);
    });

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, []);

  return { socket: socketRef.current, connected };
}
