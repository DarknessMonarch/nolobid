import { create } from "zustand";
import { persist } from "zustand/middleware";

const SERVER_API = process.env.NEXT_PUBLIC_SERVER_API;

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuth: false,
      profile:null,
      username: "",
      email: "",
      phoneNumber: "",
      userType: "",
      role: "",
      accessToken: "",
      refreshToken: "",
      firstTime: false,
      enabled: false,
      authorized:false,

      setUser: (userData) => 
        set({
          isAuth: true,
          profile:userData.profilePic.fileLink,
          username: userData.username,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          userType: userData.userType,
          role: userData.role,
          accessToken: userData.accessToken,
          refreshToken: userData.refreshToken,
          firstTime: userData.firstTime,
          enabled: userData.enabled,
          authorized:userData.authorized
        }),

      clearUser: () => 
        set({
          
          isAuth: false,
          profile: null,
          username: "",
          email: "",
          phoneNumber: "",
          userType: "",
          role: "",
          accessToken: "",
          refreshToken: "",
          firstTime: false,
          enabled: false,
          authorized:false
        }),

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          console.error("No refresh token available");
          return false;
        }

        try {
          const response = await fetch(`${SERVER_API}/users/public/promoter/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (!response.ok) {
            throw new Error("Failed to refresh token");
          }

          const data = await response.json();
          set({ accessToken: data.accessToken });
          return true;
        } catch (error) {
          console.error("Error refreshing token:", error);
          return false;
        }
      },

      getAccessToken: async () => {
        const { accessToken, refreshAccessToken } = get();
        if (!accessToken) {
          const refreshed = await refreshAccessToken();
          if (!refreshed) {
            return null;
          }
        }
        return get().accessToken;
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);