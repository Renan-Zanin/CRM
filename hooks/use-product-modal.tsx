import { create } from "zustand";

interface useProductModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useProductModal = create<useProductModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
