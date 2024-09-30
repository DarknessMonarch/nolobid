import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWalletStore = create(
  persist(
    (set) => {
      const initialState = {
        amount: 0,
        showAmount: false,
      };

      return {
        ...initialState,
        setAmount: (newAmount) => {
          set({ amount: newAmount });
        },
        toggleShowAmount: () => {
          set((state) => ({ showAmount: !state.showAmount }));
        },
        clearAmount: () => {
          set({ amount: 0 });
        },
      };
    },
    {
      name: 'wallet-storage',
      getStorage: () => localStorage,
    }
  )
);