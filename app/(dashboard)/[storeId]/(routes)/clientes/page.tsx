import Client from "./components/client";
import prismadb from "@/lib/prismadb";
import { ClientColumn } from "./components/columns";
import { telephoneFormatter } from "@/utils/phoneFormater";

export default async function DemoPage({
  params,
}: {
  params: { storeId: string };
}) {
  const clients = await prismadb.client.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const formatedClients: ClientColumn[] = clients.map((client) => ({
    id: client.id,
    name: client.name.toLocaleUpperCase(),
    phone: telephoneFormatter(client.phone),
  }));

  return (
    <div className="container mx-auto py-10">
      <Client data={formatedClients} />
    </div>
  );
}
