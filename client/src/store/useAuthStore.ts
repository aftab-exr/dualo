import { create } from 'zustand';
import { api, setAuthToken, clearAuthToken, getAuthToken } from '../services/api';

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  handle: string;
  headline?: string;
  bio?: string;
  location?: string;
  isPhoneVerified: boolean;
  phoneNumber?: string;
  streakDays: number;
  totalSwaps: number;
  remainingSwipes: number;
  skillsOffered: string[];
  skillsWanted: string[];
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        set({ isAuthenticated: false, isLoading: false });
        return;
      }
      const user = await api.get<UserProfile>('/auth/me');
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch {
      await clearAuthToken();
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (credentials) => {
    const res = await api.post<{ token: string; user: UserProfile }>('/auth/login', credentials);
    await setAuthToken(res.token);
    set({ user: res.user, token: res.token, isAuthenticated: true });
  },

  register: async (data) => {
    const res = await api.post<{ token: string; user: UserProfile }>('/auth/register', data);
    await setAuthToken(res.token);
    set({ user: res.user, token: res.token, isAuthenticated: true });
  },

  logout: async () => {
    await clearAuthToken();
    set({ user: null, token: null, isAuthenticated: false });
  },
}));