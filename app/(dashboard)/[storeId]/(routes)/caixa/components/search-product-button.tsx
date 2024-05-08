"use client";

import { Button } from "@/components/ui/button";
import { useSearchProductModal } from "@/hooks/use-search-product-modal";
import { Search } from "lucide-react";

export default function SearchProductButton() {
  const searchProductModal = useSearchProductModal();

  return (
    <Button
      className="h-[50px] absolute top-[195px] left-[495px]"
      onClick={() => searchProductModal.onOpen()}
    >
      <Search size={24} />
    </Button>
  );
}
