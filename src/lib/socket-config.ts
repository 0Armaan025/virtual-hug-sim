import { getUserId } from './user-id';

// Default to localhost for reliable local connection.
// Paste a serveo/ngrok URL in the page socket field to override for remote access.
export function getSocketUrl() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('hugroom_socket_url');
    if (stored) return stored;
  }
  return 'http://localhost:3000';
}
export const USER_ID = getUserId();
