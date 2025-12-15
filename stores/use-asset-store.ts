import { create } from "zustand";

import { TAsset } from "@/schemas/asset-schema";

type AssetStore = {
  selectedData: TAsset | null;
  setSelectedData: (data: TAsset | null) => void;
  deleteSelectedData: () => void;
};

export const useAssetStore = create<AssetStore>((set) => ({
  selectedData: null,
  setSelectedData: (data) => set({ selectedData: data }),
  deleteSelectedData: () => set({ selectedData: null }),
}));
