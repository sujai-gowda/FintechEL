// Central API client — all frontend requests go through here.
// Dev: Vite proxies /api → http://localhost:5000 (works on desktop + mobile via Network URL)
// Prod: set VITE_API_BASE=https://your-api.example.com/api in .env
export const API_BASE = import.meta.env.VITE_API_BASE || '/api';

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
});

const networkError = () =>
  new Error(
    'Cannot reach the server. Start the backend (cd backend && npm run dev) and refresh.',
  );

export const apiFetch = async (path, token, options = {}) => {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { ...authHeaders(token), ...options.headers },
    });
  } catch {
    throw networkError();
  }

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(res.ok ? 'Invalid server response' : `Request failed (${res.status})`);
  }

  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

export const apiPost = async (path, body, token = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
  } catch {
    throw networkError();
  }

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(res.ok ? 'Invalid server response' : `Request failed (${res.status})`);
  }

  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};
