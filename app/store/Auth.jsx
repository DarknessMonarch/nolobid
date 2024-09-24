import { create } from 'zustand';

export const useAuthStore = create((set) => ({
    isAuth: false,
    toggleAuth: () => set((state) => ({ isAuth: !state.isAuth })),
}));