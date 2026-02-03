/**
 * Backend API base URL. No trailing slash.
 * - Android emulator: use http://10.0.2.2:3000
 * - iOS simulator: use http://localhost:3000
 * - Physical device: use your machine's LAN IP (e.g. http://192.168.1.x:3000)
 */
export const API_BASE_URL = 'https://shirlee-bramblier-asia.ngrok-free.dev';

export const API_PREFIX = '/api';

export function getApiUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, '');
  const prefix = API_PREFIX.replace(/^\//, '').replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}/${prefix}${p}`;
}
