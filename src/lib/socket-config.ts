// Socket connection URL — local dev uses localhost; production via tunnel.
export const SOCKET_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
