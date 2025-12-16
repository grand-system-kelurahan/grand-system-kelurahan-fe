import { create } from "zustand";
import type { TAttendance } from "@/schemas/attendance-schema";

type AttendanceStore = {
  selectedData: TAttendance | null;
  setSelectedData: (data: TAttendance | null) => void;
  deleteSelectedData: () => void;
};

export const useAttendanceStore = create<AttendanceStore>((set) => ({
  selectedData: null,
  setSelectedData: (data) => set({ selectedData: data }),
  deleteSelectedData: () => set({ selectedData: null }),
}));
