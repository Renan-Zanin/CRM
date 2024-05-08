"use client";

import { useParams, useRouter } from "next/navigation";
import { SaleColumn } from "./columns";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import AlertModal from "@/components/modals/alert-modal";

interface CellActionProps {
  data: SaleColumn;
}

export default function CellAction({ data }: CellActionProps) {
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function onDelete() {
    try {
      setLoading(true);

      await axios.delete(
        `/api/clients/${params.clientId}/transaction/${data.id}`
      );
      toast.success("Transação deletada com sucesso");
      window.location.assign(`/${params.storeId}/clientes/${params.clientId}`);
    } catch (err) {
      toast.error("Não foi possível excluir a transação");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <Button onClick={() => setOpen(true)} variant="destructive" size="icon">
        <Trash className="m-2 h-4 w-4" />
      </Button>
    </>
  );
}
