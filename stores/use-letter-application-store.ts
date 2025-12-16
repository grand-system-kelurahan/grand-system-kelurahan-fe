import { create } from "zustand";

import { TLetterApplication } from "@/schemas/letter-application-schema";

type LetterApplicationStore = {
  selectedData: TLetterApplication | null;
  setSelectedData: (data: TLetterApplication | null) => void;
  deleteSelectedData: () => void;
};

export const useLetterApplicationStore = create<LetterApplicationStore>(
  (set) => ({
    selectedData: null,
    setSelectedData: (data) => set({ selectedData: data }),
    deleteSelectedData: () => set({ selectedData: null }),
  })
);
