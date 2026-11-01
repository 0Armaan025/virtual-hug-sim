import { io, Socket } from 'socket.io-client';
import { getSocketUrl } from './socket-config';

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io(getSocketUrl(), {
      transports: ['polling', 'websocket'],
      upgrade: true,
      rememberUpgrade: false,
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
