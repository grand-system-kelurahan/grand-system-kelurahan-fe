import { create } from "zustand";
import { TAssetLoanWithRelations } from "@/schemas/asset-loan-schema";

interface AssetLoanStore {
  selectedData: TAssetLoanWithRelations | null;
  filters: {
    status?: string;
    fromDate?: string;
    toDate?: string;
    keyword?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  };
  setSelectedData: (data: TAssetLoanWithRelations | null) => void;
  setFilters: (filters: Partial<AssetLoanStore["filters"]>) => void;
}

export const useAssetLoanStore = create<AssetLoanStore>((set) => ({
  selectedData: null,
  filters: {
    status: undefined,
    fromDate: undefined,
    toDate: undefined,
    keyword: "",
    sortBy: "created_at",
    sortOrder: "desc",
  },
  setSelectedData: (data) => set({ selectedData: data }),
  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
}));