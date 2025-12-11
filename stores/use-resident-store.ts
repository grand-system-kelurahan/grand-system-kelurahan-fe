import { create } from "zustand";

import { TResident } from "@/schemas/resident-schema";

type ResidentStore = {
  selectedData: TResident | null;
  setSelectedData: (data: TResident | null) => void;
  deleteSelectedData: () => void;
};

export const useResidentStore = create<ResidentStore>((set) => ({
  selectedData: null,
  setSelectedData: (data) => set({ selectedData: data }),
  deleteSelectedData: () => set({ selectedData: null }),
}));
