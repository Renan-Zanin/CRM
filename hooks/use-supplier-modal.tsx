import { create } from "zustand";

interface useSupplierModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useSupplierModal = create<useSupplierModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
