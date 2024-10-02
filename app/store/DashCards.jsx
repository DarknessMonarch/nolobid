import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useDashCardStore = create(
  persist(
    (set, get) => ({
      showCard: "Referral",
      setShowCard: (name) =>
        set({
          showCard: name,
        }),
    }),
    {
      name: "dashcard-storage",
      getStorage: () => localStorage,
    }
  )
);
