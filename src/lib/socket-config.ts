import { getUserId } from "./user-id";

// IMPORTANT: After connecting serveo tunnel, update this URL to the exact public URL serveo gives you,
// then redeploy: vercel deploy --prod (or push and let Vercel redeploy).
// Example: export const SOCKET_URL = 'https://810adc8...serveousercontent.com';
export const SOCKET_URL =
  "https://2744cff87e5c9dbd-171-61-31-186.serveousercontent.com";
export const USER_ID = getUserId();
