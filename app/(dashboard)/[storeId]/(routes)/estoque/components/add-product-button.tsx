"use client";

import { Button } from "@/components/ui/button";
import { useProductModal } from "@/hooks/use-product-modal";

export default function AddProductButton() {
  const productModal = useProductModal();

  return (
    <Button onClick={() => productModal.onOpen()}>
      Adicionar novo Produto
    </Button>
  );
}
