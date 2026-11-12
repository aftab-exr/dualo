import { Preferences } from '@capacitor/preferences';
import { useAuthStore } from '../store/useAuthStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const TOKEN_KEY = 'dualo_auth_token';

// Synchronous token accessor from Zustand store (avoids race conditions on mount)
function getTokenSync(): string | null {
  const state = useAuthStore.getState();
  return state.token ?? null;
}

// Fallback to check capacitorStorage directly for persisted Zustand state
async function getTokenFromPersistedStorage(): Promise<string | null> {
  try {
    const { value } = await Preferences.get({ key: 'dualo-auth-storage' });
    if (value) {
      const parsed = JSON.parse(value);
      if (parsed.state?.token) {
        return parsed.state.token;
      }
    }
  } catch {
    // Ignore parse errors
  }
  return null;
}

export async function getAuthToken(): Promise<string | null> {
  // 1. Check store first (synchronous)
  const syncToken = getTokenSync();
  if (syncToken) return syncToken;
  
  // 2. Check dedicated token key
  const { value } = await Preferences.get({ key: TOKEN_KEY });
  if (value) return value;
  
  // 3. Check persisted Zustand storage
  return await getTokenFromPersistedStorage();
}

export async function setAuthToken(token: string): Promise<void> {
  await Preferences.set({ key: TOKEN_KEY, value: token });
  // Also update Zustand store immediately
  useAuthStore.setState({ token });
}

export async function clearAuthToken(): Promise<void> {
  await Preferences.remove({ key: TOKEN_KEY });
  await Preferences.remove({ key: 'dualo-auth-storage' });
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