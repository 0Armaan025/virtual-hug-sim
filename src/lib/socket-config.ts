import { getUserId } from './user-id';

// Default to localhost for reliable local connection.
// Paste a serveo/ngrok URL in the page socket field to override for remote access.
export function getSocketUrl() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('hugroom_socket_url');
    if (stored && stored !== 'null' && stored !== 'undefined' && stored.trim() !== '') {
      // Ignore broken remote tunnel URLs when the server is unavailable
      try {
        const url = new URL(stored);
        if (url.protocol === 'https:' || url.protocol === 'http:') {
          return stored.trim();
        }
      } catch {
        // Invalid URL, fall through
      }
    }
  }
  return 'http://localhost:3000';
}
export const USER_ID = getUserId();
