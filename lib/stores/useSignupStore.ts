import { create } from 'zustand';

interface SignupState {
  username: string | null;
  email: string | null;
  password: string | null;
  confirmPassword: string | null;
  setUsername: (username: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
}

export const useSignupStore = create<SignupState>((set) => ({
  username: null,
  email: null,
  password: null,
  confirmPassword: null,
  setUsername: (username) => set({ username }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
})); 