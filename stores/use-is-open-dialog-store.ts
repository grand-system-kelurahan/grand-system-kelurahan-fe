import { create } from "zustand";

type TAction =
  | "add"
  | "edit"
  | "delete"
  | "approve"
  | "rejected"
  | "edit-relationship"
  | "delete-relationship"
  | "approve"
  | "return"
  | "reject"
  | "view"
  | null;

type useIsDialogOpenStoreType = {
  isDialogOpen: boolean;
  dialogType: TAction;
  openDialog: (type: TAction) => void;
  closeDialog: () => void;
};

export const useIsDialogOpenStore = create<useIsDialogOpenStoreType>((set) => ({
  isDialogOpen: false,
  dialogType: null,
  openDialog: (type) =>
    set({
      isDialogOpen: true,
      dialogType: type,
    }),
  closeDialog: () =>
    set({
      isDialogOpen: false,
      dialogType: null,
    }),
}));
