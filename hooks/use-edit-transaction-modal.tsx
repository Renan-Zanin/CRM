import { create } from "zustand";

interface Transaction {
  id: string;
  amount: number;
  type: "incoming" | "outgoing" | "fiado_pending";
  paymentMethod:
    | "cash"
    | "credit_card"
    | "debit_card"
    | "pix"
    | "fiado"
    | "fiado_payment";
  description?: string;
}

interface EditTransactionModalStore {
  isOpen: boolean;
  transaction: Transaction | null;
  onOpen: (transaction: Transaction) => void;
  onClose: () => void;
}

export const useEditTransactionModal = create<EditTransactionModalStore>(
  (set) => ({
    isOpen: false,
    transaction: null,
    onOpen: (transaction: Transaction) => set({ isOpen: true, transaction }),
    onClose: () => set({ isOpen: false, transaction: null }),
  })
);
