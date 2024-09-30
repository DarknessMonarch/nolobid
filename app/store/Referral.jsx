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
    generateMockReferralLink: () => {
      const mockLink = `https://nolobid.com/refer/${Math.random().toString(36).substr(2, 9)}`;
      set({ referralLink: mockLink });
    },
  };
});