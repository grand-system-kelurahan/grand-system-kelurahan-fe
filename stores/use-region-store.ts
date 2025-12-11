import { create } from "zustand";

import { TRegion } from "@/schemas/region-schema";

type RegionStore = {
  selectedData: TRegion | null;
  setSelectedData: (data: TRegion | null) => void;
  deleteSelectedData: () => void;
};

export const useRegionStore = create<RegionStore>((set) => ({
  selectedData: null,
  setSelectedData: (data) => set({ selectedData: data }),
  deleteSelectedData: () => set({ selectedData: null }),
}));
