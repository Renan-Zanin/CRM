import Heading from "@/components/ui/heading";
import { ProductColumn, columns } from "./columns";
import { Separator } from "@/components/ui/separator";
import AddProductButton from "./add-product-button";
import { DataTable } from "./data-table";

interface SupplierDataProps {
  data: ProductColumn[];
}

export default function Supplier({ data }: SupplierDataProps) {
  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <Heading
          title={`Produtos em estoque (${data.length})`}
          description="Gerencie seu estoque"
        />
        <AddProductButton />
      </div>
      <Separator className="mb-6" />

      <DataTable columns={columns} data={data} />
    </>
  );
}
