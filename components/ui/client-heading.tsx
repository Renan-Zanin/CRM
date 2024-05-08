"use client";

import { ClientColumn } from "@/app/(dashboard)/[storeId]/(routes)/clientes/components/columns";
import { telephoneFormatter } from "@/utils/phoneFormater";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

import { Button } from "./button";
import { Separator } from "./separator";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import AlertModal from "../modals/alert-modal";

export default function ClientHeading() {
  const [clientHeading, setClientHeading] = useState<ClientColumn | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();

  let phoneFormated;

  function goToEditPage() {
    router.push(`/${params.storeId}/clientes/${params.clientId}/editar`);
  }

  async function getHeading() {
    try {
      await axios
        .get(`/api/${params.storeId}/clients/${params.clientId}`)
        .then((response) => {
          setClientHeading(response.data);
        })
        .catch((err) => {
          toast.error("Cliente não encontrado");
        });
    } catch (err) {
      toast.error("Cliente não encontrado");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    try {
      setLoading(true);

      await axios.delete(`/api/clients/${params.clientId}`);
      router.refresh();
      router.push(`/${params.storeId}/clientes`);
      toast.success("Cliente excluído com sucesso");
    } catch (err) {
      toast.error("Não foi possível excluir o cliente");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  useEffect(() => {
    getHeading();
  }, []);

  if (clientHeading !== null) {
    phoneFormated = telephoneFormatter(clientHeading.phone);
  }

  return (
    <div className="md:mt-10 mt-[-16px] mx-auto">
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex justify-between items-center mb-6 md:flex-row flex-col">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-[3vh] w-[5vw]" />
            <Skeleton className="h-[2vh] w-[8vw]" />
          </div>
        ) : (
          <div className="flex md:flex-col mb-4 items-center">
            <h2 className="text-3xl font-bold tracking-tight mr-6 md:mr-0">
              {clientHeading?.name.toLocaleUpperCase()}
            </h2>
            <h1>{phoneFormated}</h1>{" "}
          </div>
        )}

        <div className="flex justify-center gap-8">
          <Button onClick={goToEditPage} disabled={loading}>
            Editar
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
            disabled={loading}
          >
            <Trash className="h4- w-4" />
          </Button>
        </div>
      </div>

      <Separator />
    </div>
  );
}
