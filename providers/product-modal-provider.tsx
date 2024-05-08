"use client";

import { ProductModal } from "@/components/modals/product-modal";
import { useEffect, useState } from "react";

export function ProductModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <ProductModal />
    </>
  );
}
