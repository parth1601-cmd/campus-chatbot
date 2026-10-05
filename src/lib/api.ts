/**
 * Centralized API base URL.
 *
 * - Local dev with `tsx server.ts` (Vite middleware): VITE_API_URL is unset -> same-origin `/api/...`.
 * - Split deployment (static frontend + separate backend, e.g. Vercel frontend
 *   + Render/Railway backend): set `VITE_API_URL=https://your-backend.onrender.com`
 *   in the frontend host's env vars and redeploy. No trailing slash.
 */
export const API_BASE_URL: string = (
  (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.VITE_API_URL || ''
).replace(/\/+$/, '');

export function apiUrl(path: string): string {
  if (!path.startsWith('/')) path = `/${path}`;
  return `${API_BASE_URL}${path}`;
}

/** Drop-in replacement for fetch() against our own backend. */
export function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(apiUrl(path), init);
}
