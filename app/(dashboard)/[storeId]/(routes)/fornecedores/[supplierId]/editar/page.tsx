import prismadb from "@/lib/prismadb";
import SupplierForm from "./components/suplier-form";

export default async function EditarPage({
  params,
}: {
  params: { supplierId: string };
}) {
  const client = await prismadb.supplier.findUnique({
    where: {
      id: params.supplierId,
    },
  });

  return (
    <div className="container mx-auto py-10">
      <SupplierForm initialData={client} />
    </div>
  );
}
