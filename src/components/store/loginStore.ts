import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Store {
  fullName: string;
  role: string;
  isLoggedIn: boolean;
  token: string;
  userId: number;

  setFullName: (fullName: string) => void;
  setRole: (role: string) => void;
  changeLogInState: () => void;
  setToken: (token: string) => void;
  setUserId: (id: number) => void;
  resetLoginStore: () => void;
}

const initialState = {
  fullName: '',
  role: '',
  isLoggedIn: false,
  token: '',
  userId: 0,
};

export const useLoginStore = create<Store>()(
  persist(
    (set, get) => ({
      ...initialState,
      setFullName: (fullName) => set({ fullName }),
      setRole: (role) => set({ role }),
      changeLogInState: () => set({ isLoggedIn: !get().isLoggedIn }),
      setToken: (token) => set({ token }),
      setUserId: (id) => set({ userId: id }),
      resetLoginStore: () => set({ ...initialState }),
    }),
    { name: 'login-storage' }
  )
)