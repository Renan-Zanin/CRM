"use client";

import { Button } from "@/components/ui/button";
import { useSupplierModal } from "@/hooks/use-supplier-modal";

export default function AddSupplierButton() {
  const supplierModal = useSupplierModal();

  return (
    <Button onClick={() => supplierModal.onOpen()}>
      Adicionar novo Fornecedor
    </Button>
  );
}
