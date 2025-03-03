import { create } from "zustand";

interface LoginState {
  username: string | null;
  password: string;
  setField: (field: keyof LoginState, value: string) => void;
  reset: () => void;
}

export const useLoginStore = create<LoginState>((set) => ({
  username: "",
  password: "",
  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  reset: () => set({ username: "", password: "" }),
}));
