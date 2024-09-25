import { create } from 'zustand';

const LOCAL_STORAGE_KEY = 'authStore';

const loadAuthState = () => {
  if (typeof window !== 'undefined') {
    const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedData
      ? JSON.parse(storedData)
      : {
          isAuth: false,
          email: '',
          username: '',
          token: '',
          accountType: '',
          phoneNumber: '',
          // access token and refresh token
        };
  }
  return {
    isAuth: false,
    email: '',
    username: '',
    token: '',
    accountType: '',
    phoneNumber: '',
  };
};

export const useAuthStore = create((set, get) => {
  const initialState = loadAuthState();

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
    toggleAuth: () => {
      set((state) => {
        const newAuthState = { isAuth: !state.isAuth };
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...state, ...newAuthState }));
        }
        return newAuthState;
      });
    },
    setUser: (email, username, token, accountType, phoneNumber) => {
      set((state) => {
        const newUserData = { email, username, token, accountType, phoneNumber };
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ ...state, ...newUserData }));
        }
        return { ...state, ...newUserData };
      });
    },
    clearUser: () => {
      set(() => {
        const clearedState = {
          isAuth: false,
          email: '',
          username: '',
          token: '',
          accountType: '',
          phoneNumber: '',
        };
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(clearedState));
        }
        return clearedState;
      });
    },
  };
});
