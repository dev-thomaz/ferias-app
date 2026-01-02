import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserRole = "GESTOR" | "COLABORADOR" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarID?: number | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      logout: () => {
        set({ user: null, isAuthenticated: false });
        AsyncStorage.removeItem("auth-storage-ferias");
      },
    }),
    {
      name: "auth-storage-ferias",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
