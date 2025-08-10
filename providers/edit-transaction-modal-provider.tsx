"use client";

import { useEffect, useState } from "react";
import { EditTransactionModal } from "@/components/modals/edit-transaction-modal";

export const EditTransactionModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <EditTransactionModal />
    </>
  );
};
