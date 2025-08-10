import { create } from "zustand";

interface useCashRegisterModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCashRegisterModal = create<useCashRegisterModalStore>(
  (set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  })
);
