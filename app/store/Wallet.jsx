import { create } from 'zustand';

const LOCAL_STORAGE_KEY = 'walletStore';

const loadState = () => {
  if (typeof window !== 'undefined') {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : { amount: 500, showAmount: false };
  }
  return { amount: 500, showAmount: false }; 
};

export const useWalletStore = create((set, get) => {
  const initialState = loadState();

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialState));
  }

  const updateStoreFromLocalStorage = (event) => {
    if (event.key === LOCAL_STORAGE_KEY) {
      const newState = JSON.parse(event.newValue);
      set(newState);
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', updateStoreFromLocalStorage);
  }

  return {
    ...initialState,
    setAmount: (newAmount) => {
      set({ amount: newAmount });
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...get(), amount: newAmount }));
      }
    },
    toggleShowAmount: () => {
      set((state) => {
        const newState = { showAmount: !state.showAmount };
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...get(), ...newState }));
        }
        return newState; 
      });
    },
    deposit: (value) => {
      set((state) => {
        const newAmount = state.amount + value;
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...get(), amount: newAmount }));
        }
        return { amount: newAmount };
      });
    },
    withdraw: (value) => {
      set((state) => {
        const newAmount = state.amount - value;
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...get(), amount: newAmount }));
        }
        return { amount: newAmount };
      });
    },
  };
});
