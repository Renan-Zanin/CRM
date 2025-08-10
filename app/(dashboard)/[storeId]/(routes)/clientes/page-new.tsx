"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Client from "./components/client";
import { ClientColumn } from "./components/columns";
import { telephoneFormatter } from "@/utils/phoneFormater";
import { useDataCache } from "@/contexts/DataCacheContext";
import Loading from "@/components/ui/loading";

export default function ClientsPage() {
  const params = useParams();
  const { state, fetchClients } = useDataCache();
  const [formattedClients, setFormattedClients] = useState<ClientColumn[]>([]);

  useEffect(() => {
    if (params.storeId) {
      fetchClients(params.storeId as string);
    }
  }, [params.storeId, fetchClients]);

  useEffect(() => {
    const formatted: ClientColumn[] = state.clients.map((client: any) => ({
      id: client.id,
      name: client.name.toLocaleUpperCase(),
      phone: telephoneFormatter(client.phone),
    }));
    setFormattedClients(formatted);
  }, [state.clients]);

  if (state.loading.clients) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto py-10">
      <Client data={formattedClients} />
    </div>
  );
}
