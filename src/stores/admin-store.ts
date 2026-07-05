import { create } from "zustand";

interface AdminStore {
  isAuthenticated: boolean;
  username: string | null;
  isLoading: boolean;
  setAuth: (username: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  isAuthenticated: false,
  username: null,
  isLoading: true,
  setAuth: (username) => set({ isAuthenticated: true, username, isLoading: false }),
  clearAuth: () => set({ isAuthenticated: false, username: null, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
