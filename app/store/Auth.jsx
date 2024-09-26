import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuth: false,
      username: "",
      email: "",
      phoneNumber: "",
      userType: "",
      role: "",
      accessToken: "",
      refreshToken: "",
      firstTime: false,
      enabled: false,

      setUser: (userData) => 
        set({
          isAuth: true,
          username: userData.username,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          userType: userData.userType,
          role: userData.role,
          accessToken: userData.accessToken,
          refreshToken: userData.refreshToken,
          firstTime: userData.firstTime,
          enabled: userData.enabled,
        }),

      clearUser: () => 
        set({
          isAuth: false,
          username: "",
          email: "",
          phoneNumber: "",
          userType: "",
          role: "",
          accessToken: "",
          refreshToken: "",
          firstTime: false,
          enabled: false,
        }),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);