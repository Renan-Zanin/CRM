"use client";

import { SupplierModal } from "@/components/modals/supplier-modal";
import { useEffect, useState } from "react";

export function SupplierModalProvider() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SupplierModal />
    </>
  );
}
