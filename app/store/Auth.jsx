import { create } from 'zustand';

const LOCAL_STORAGE_KEY = 'authStore';

const loadAuthState = () => {
  if (typeof window !== 'undefined') {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : { isAuth: false };
  }
  return { isAuth: false }; 
};

export const useAuthStore = create((set, get) => {
  const initialState = loadAuthState();

  return {
    ...initialState,
    toggleAuth: () => {
      set((state) => {
        const newAuthState = { isAuth: !state.isAuth };
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...state, ...newAuthState }));
        }
        return newAuthState;
      });
    },
    
  };
});
