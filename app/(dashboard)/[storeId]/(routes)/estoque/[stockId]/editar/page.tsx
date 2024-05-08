import prismadb from "@/lib/prismadb";
import StockForm from "./components/stock-form";

export default async function EditarPage({
  params,
}: {
  params: { stockId: string };
}) {
  const product = await prismadb.product.findUnique({
    where: {
      id: params.stockId,
    },
  });

  return (
    <div className="container mx-auto py-10">
      <StockForm initialData={product} />
    </div>
  );
}
