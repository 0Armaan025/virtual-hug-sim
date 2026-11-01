import { getUserId } from './user-id';

// Read socket URL from localStorage (user pastes serveo URL there), fallback to hardcoded
export function getSocketUrl() {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('hugroom_socket_url');
    if (stored) return stored;
  }
  return 'https://810adc861d9ff92b-171-61-31-186.serveousercontent.com';
}
export const USER_ID = getUserId();
