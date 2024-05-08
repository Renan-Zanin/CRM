import prismadb from "@/lib/prismadb";
import ClientForm from "./components/client-form";

export default async function EditarPage({
  params,
}: {
  params: { clientId: string };
}) {
  const client = await prismadb.client.findUnique({
    where: {
      id: params.clientId,
    },
  });

  return (
    <div className="container mx-auto py-10">
      <ClientForm initialData={client} />
    </div>
  );
}
