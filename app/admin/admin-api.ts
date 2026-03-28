// ─── Admin API Helpers (client-side mock fallback) ───
const ADMIN_KEY = 'winbig-admin-key-2026';

interface ApiOptions {
  adminKey?: boolean;
}

async function adminFetch<T>(url: string, options: RequestInit = {}, opts: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  // Add admin key if needed
  if (opts.adminKey) {
    headers['X-Admin-Key'] = ADMIN_KEY;
  }

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

// Re-export everything from api.ts plus admin-specific helpers
export { adminFetch };

// Admin key for server-side auth (used with X-Admin-Key header)
export const ADMIN_API_KEY = ADMIN_KEY;
