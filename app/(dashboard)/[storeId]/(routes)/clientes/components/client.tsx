import Heading from "@/components/ui/heading";
import { ClientColumn, columns } from "./columns";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import AddClientButton from "./addClientbutton";

interface ClientDataProps {
  data: ClientColumn[];
}

export default function Client({ data }: ClientDataProps) {
  return (
    <>
      <div className="flex md:flex-row flex-col space-y-4 md:space-y-0 items-center justify-between pb-4">
        <Heading
          title={`Clientes (${data.length})`}
          description="Gerencie os seus clientes"
        />
        <AddClientButton />
      </div>
      <Separator className="md:mb-6 mb-2" />

      <DataTable columns={columns} data={data} />
    </>
  );
}
