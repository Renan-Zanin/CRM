import Heading from "@/components/ui/heading";
import { SupplierColumn, columns } from "./columns";
import { Separator } from "@/components/ui/separator";
import AddSupplierButton from "./add-supplier-button";
import { DataTable } from "./data-table";

interface SupplierDataProps {
  data: SupplierColumn[];
}

export default function Supplier({ data }: SupplierDataProps) {
  return (
    <>
      <div className="flex items-center justify-between pb-4">
        <Heading
          title={`Fornecedores (${data.length})`}
          description="Gerencie seus fornecedores"
        />
        <AddSupplierButton />
      </div>
      <Separator className="mb-6" />

      <DataTable columns={columns} data={data} />
    </>
  );
}
