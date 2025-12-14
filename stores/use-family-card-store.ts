import { create } from "zustand";

import { TFamilyCard } from "@/schemas/family-card-schema";

type FamilyCardStore = {
  selectedData: TFamilyCard | null;
  setSelectedData: (data: TFamilyCard | null) => void;
  deleteSelectedData: () => void;
};

export const useFamilyCardStore = create<FamilyCardStore>((set) => ({
  selectedData: null,
  setSelectedData: (data) => set({ selectedData: data }),
  deleteSelectedData: () => set({ selectedData: null }),
}));
