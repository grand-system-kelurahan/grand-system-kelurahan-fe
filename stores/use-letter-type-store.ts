import { create } from "zustand";

import { TLetterType } from "@/schemas/letter-type-schema";

type LetterTypeStore = {
  selectedData: TLetterType | null;
  setSelectedData: (data: TLetterType | null) => void;
  deleteSelectedData: () => void;
};

export const useLetterTypeStore = create<LetterTypeStore>((set) => ({
  selectedData: null,
  setSelectedData: (data) => set({ selectedData: data }),
  deleteSelectedData: () => set({ selectedData: null }),
}));
