import { create } from "zustand";
import { UserData } from "@/lib/types";

export type UserState = {
  user: UserData | null;
  setUser: (user: UserData) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: null, // No accede a localStorage aquí
  setUser: (user) => {
    set({ user });
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  },
  clearUser: () => {
    set({ user: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
  },
}));