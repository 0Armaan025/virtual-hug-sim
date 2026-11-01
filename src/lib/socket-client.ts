import { io, Socket } from 'socket.io-client';
import { getSocketUrl } from './socket-config';

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    try {
      socket = io(getSocketUrl(), {
        transports: ['polling', 'websocket'],
        upgrade: true,
        rememberUpgrade: false,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
      });
      socket.on('connect_error', (err: any) => {
        console.warn('Socket connect error (expected if server is unavailable):', err.message || err);
      });
    } catch (e: any) {
      console.warn('Failed to initialize socket:', e?.message || e);
      socket = null as any;
    }
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
