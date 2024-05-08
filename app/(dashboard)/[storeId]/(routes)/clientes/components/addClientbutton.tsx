"use client";

import { Button } from "@/components/ui/button";
import { useClientModal } from "@/hooks/use-client-modal";
import { useParams } from "next/navigation";

export default function AddClientButton() {
  const clientModal = useClientModal();

  const params = useParams();

  console.log(params.storeId);

  return (
    <Button onClick={() => clientModal.onOpen()}>Adicionar novo cliente</Button>
  );
}
