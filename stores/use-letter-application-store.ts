import { create } from "zustand";

import { TLetterApplicationWithRelation } from "@/schemas/letter-application-schema";

type LetterApplicationStore = {
  selectedData: TLetterApplicationWithRelation | null;
  setSelectedData: (data: TLetterApplicationWithRelation | null) => void;
  deleteSelectedData: () => void;
};

export const useLetterApplicationStore = create<LetterApplicationStore>(
  (set) => ({
    selectedData: null,
    setSelectedData: (data) => set({ selectedData: data }),
    deleteSelectedData: () => set({ selectedData: null }),
  })
);
