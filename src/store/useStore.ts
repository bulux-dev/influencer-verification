import { create } from 'zustand';
import type { Influencer } from '../types';

interface Store {
  selectedDateRange: [Date | null, Date | null];
  setDateRange: (range: [Date | null, Date | null]) => void;
  claimsLimit: number;
  setClaimsLimit: (limit: number) => void;
  selectedInfluencer: Influencer | null;
  setSelectedInfluencer: (influencer: Influencer | null) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
}

export const useStore = create<Store>((set) => ({
  selectedDateRange: [null, null],
  setDateRange: (range) => set({ selectedDateRange: range }),
  claimsLimit: 50,
  setClaimsLimit: (limit) => set({ claimsLimit: limit }),
  selectedInfluencer: null,
  setSelectedInfluencer: (influencer) => set({ selectedInfluencer: influencer }),
  apiKey: '',
  setApiKey: (key) => set({ apiKey: key }),
}));