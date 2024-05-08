import { create } from "zustand";

interface useClientModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useClientModal = create<useClientModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
