import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { capacitorStorage } from "../store/capacitorStorage";
import { api, setAuthToken, clearAuthToken, getAuthToken } from "../services/api";
import type { UserProfileResponse } from "../types/api";

export interface AuthState {
  user: UserProfileResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token?: string | null;

  // Actions
  loginWithGoogle: (idToken: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (data: {
    email: string;
    password: string;
    fullName: string;
    handle: string;
    skillsOffered: string[];
    skillsWanted: string[];
  }) => Promise<void>;
  verifyPhone: (phoneNumber: string, otpCode: string) => Promise<void>;
  fetchProfile: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;

  // Compatibility aliases
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: any) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      token: null,

      clearError: () => set({ error: null }),

      login: async (credentials) => {
        return get().loginWithEmail(credentials.email, credentials.password);
      },

      register: async (data) => {
        return get().registerWithEmail(data);
      },

      checkAuth: async () => {
        const token = await getAuthToken();
        if (!token) {
          set({ isAuthenticated: false, isLoading: false });
          return;
        }
        try {
          const user = await api.get<UserProfileResponse>('/auth/me');
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch {
          await clearAuthToken();
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      },

      loginWithGoogle: async (idToken: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<{ token: string; user: UserProfileResponse }>('/auth/google', { idToken });
          await setAuthToken(response.token);
          set({ user: response.user, token: response.token, isAuthenticated: true, isLoading: false });
        } catch (err: any) {
          set({ error: err.message || 'Google login failed', isLoading: false });
          throw err;
        }
      },

      loginWithEmail: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<{ token: string; user: UserProfileResponse }>('/auth/login', { email, password });
          await setAuthToken(response.token);
          set({ user: response.user, token: response.token, isAuthenticated: true, isLoading: false });
        } catch (err: any) {
          set({ error: err.message || 'Email login failed', isLoading: false });
          throw err;
        }
      },

      registerWithEmail: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<{ token: string; user: UserProfileResponse }>('/auth/register', data);
          await setAuthToken(response.token);
          set({ user: response.user, token: response.token, isAuthenticated: true, isLoading: false });
        } catch (err: any) {
          set({ error: err.message || 'Registration failed', isLoading: false });
          throw err;
        }
      },

      verifyPhone: async (phoneNumber: string, otpCode: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<UserProfileResponse>('/auth/verify-phone', { phoneNumber, otpCode });
          set({ user: response, isLoading: false });
        } catch (err: any) {
          set({ error: err.message || 'Phone verification failed', isLoading: false });
          throw err;
        }
      },

      fetchProfile: async () => {
        const { isAuthenticated } = get();
        if (!isAuthenticated) return;

        try {
          const user = await api.get<UserProfileResponse>('/auth/me');
          set({ user });
        } catch (err: any) {
          if (err.message?.includes('401')) {
            get().logout();
          }
        }
      },

      logout: async () => {
        await clearAuthToken();
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },
    }),
    {
      name: 'dualo-auth-storage',
      storage: createJSONStorage(() => capacitorStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);