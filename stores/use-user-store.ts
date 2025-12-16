import { create } from "zustand";

import { TUser } from "@/schemas/user-schema";

type UserStore = {
  selectedData: TUser | null;
  setSelectedData: (data: TUser | null) => void;
  deleteSelectedData: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  selectedData: null,
  setSelectedData: (data) => set({ selectedData: data }),
  deleteSelectedData: () => set({ selectedData: null }),
}));
