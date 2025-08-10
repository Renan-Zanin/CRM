"use client";

import { useEffect, useState } from "react";
import { CashRegisterModal } from "@/components/modals/cash-register-modal";

export const CashRegisterModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CashRegisterModal />
    </>
  );
};
