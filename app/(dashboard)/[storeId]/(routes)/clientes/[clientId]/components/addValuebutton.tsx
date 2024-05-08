"use client";

import { Button } from "@/components/ui/button";
import { useTransactionModal } from "@/hooks/useTransactionModal";

export default function AddValueButton() {
  const transactionModal = useTransactionModal();

  return (
    <Button onClick={() => transactionModal.onOpen()}>
      Adicionar novo valor
    </Button>
  );
}
