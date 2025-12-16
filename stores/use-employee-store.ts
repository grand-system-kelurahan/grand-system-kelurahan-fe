import { create } from "zustand";

import { TEmployeeWithRelation } from "@/schemas/employee-schema";

type EmployeeStore = {
  selectedData: TEmployeeWithRelation | null;
  setSelectedData: (data: TEmployeeWithRelation | null) => void;
  deleteSelectedData: () => void;
};

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  selectedData: null,
  setSelectedData: (data) => set({ selectedData: data }),
  deleteSelectedData: () => set({ selectedData: null }),
}));
