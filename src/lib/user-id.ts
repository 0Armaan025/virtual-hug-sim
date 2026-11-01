export const USER_ID_KEY = 'hugroom_user_id';

export function getUserId() {
  if (typeof window === 'undefined') return 'server';
  let id = localStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = 'u_' + Math.random().toString(36).slice(2, 11);
    localStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}
