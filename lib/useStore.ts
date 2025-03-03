import { create } from "zustand";
import { User } from "@supabase/supabase-js";

interface UserState {
  user: User | null;
  username: string | null;
  setUser: (user: User | null) => void;
  setUsername: (username: string | null) => void;
}

export const useStore = create<UserState>((set) => ({
  user: null,
  username: null,
  setUser: (user) => set({ user }),
  setUsername: (username) => set({ username }),
}));
