import { create } from "zustand";
import { UserData } from "@/lib/types";


export type UserState = {
  user: UserData | null;
  setUser: (user: UserData) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
