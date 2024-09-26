import { create } from 'zustand';

export const useWalletStore = create((set) => {
  const initialState = {
    amount: 500,
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
    deposit: (value) => {
      set((state) => ({ amount: state.amount + value }));
    },
    withdraw: (value) => {
      set((state) => ({ amount: state.amount - value }));
    },
  };
});
