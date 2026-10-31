import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "./socket-config";

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["polling", "websocket"],
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

export function reconnectSocket() {
  disconnectSocket();
  return getSocket();
}
