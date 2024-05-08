import { create } from "zustand";

interface useTransactionModal {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useTransactionModal = create<useTransactionModal>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
