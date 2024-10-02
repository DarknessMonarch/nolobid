import { create } from 'zustand';

export const useReferralStore = create((set) => {
  const initialState = {
    referrals: [],
    referralLink: '',
  };

  return {
    ...initialState,
    setReferrals: (newReferrals) => set({ referrals: newReferrals }),
    addReferral: (newReferral) => set((state) => ({ referrals: [...state.referrals, newReferral] })),
    setReferralLink: (link) => set({ referralLink: link }),
  };
});