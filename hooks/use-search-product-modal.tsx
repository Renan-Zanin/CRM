import { create } from "zustand";

interface useSearchProductModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useSearchProductModal = create<useSearchProductModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
