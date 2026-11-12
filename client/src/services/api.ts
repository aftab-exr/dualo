import { Preferences } from '@capacitor/preferences';
import { useAuthStore } from '../store/useAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const TOKEN_KEY = 'dualo_auth_token';

// Synchronous token accessor from Zustand store (avoids race conditions on mount)
function getTokenSync(): string | null {
  const state = useAuthStore.getState();
  return state.token ?? null;
}

export async function getAuthToken(): Promise<string | null> {
  // Check store first (synchronous), then fall back to persistent storage
  const syncToken = getTokenSync();
  if (syncToken) return syncToken;
  
  const { value } = await Preferences.get({ key: TOKEN_KEY });
  return value;
}

export async function setAuthToken(token: string): Promise<void> {
  await Preferences.set({ key: TOKEN_KEY, value: token });
  // Also update Zustand store immediately
  useAuthStore.setState({ token });
}

export async function clearAuthToken(): Promise<void> {
  await Preferences.remove({ key: TOKEN_KEY });
  useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Synchronous token check from Zustand store first (no await race)
  const token = getTokenSync() || await getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // If 401, clear auth state
    if (response.status === 401) {
      await clearAuthToken();
    }
    throw new Error(data.detail || 'An API error occurred');
  }

  return data as T;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};