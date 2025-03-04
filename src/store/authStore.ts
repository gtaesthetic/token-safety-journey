
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { mockAuthApi } from '../services/mockAuth';

export type UserRole = 'employee' | 'manager';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  exp: number;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// Helper function to extract user data from JWT token
const extractUserFromToken = (token: string): User | null => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    
    // Check if token has expired
    if (decoded.exp * 1000 < Date.now()) {
      return null;
    }
    
    return {
      id: decoded.sub,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role
    };
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // Use the mock API instead of fetch
          const data = await mockAuthApi.login(email, password);
          
          // Extract user information from the token
          const user = extractUserFromToken(data.token);
          
          if (!user) {
            throw new Error('Invalid or expired token');
          }
          
          set({
            token: data.token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
        }
      },

      register: async (name: string, email: string, password: string, role: UserRole) => {
        try {
          set({ isLoading: true, error: null });
          
          // Use the mock API instead of fetch
          const data = await mockAuthApi.register(name, email, password, role);
          
          // Extract user information from the token
          const user = extractUserFromToken(data.token);
          
          if (!user) {
            throw new Error('Invalid or expired token');
          }
          
          set({
            token: data.token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Registration failed',
          });
        }
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
