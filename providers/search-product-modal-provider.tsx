"use client";

import { SearchProductModal } from "@/components/modals/search-product-modal";
import { useEffect, useState } from "react";

export function SearchProductModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SearchProductModal />
    </>
  );
}
