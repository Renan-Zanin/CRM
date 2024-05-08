"use client";

import { useEffect, useState } from "react";

import { TransactionModal } from "@/components/modals/transaction-modal";
import { useParams } from "next/navigation";

export function TransactionModalProvider() {
  const [isMounted, setIsMounted] = useState(false);
  const params = useParams();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <TransactionModal />
    </>
  );
}
