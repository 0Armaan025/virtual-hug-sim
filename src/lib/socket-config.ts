import { getUserId } from './user-id';

export const SOCKET_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
export const USER_ID = getUserId();
