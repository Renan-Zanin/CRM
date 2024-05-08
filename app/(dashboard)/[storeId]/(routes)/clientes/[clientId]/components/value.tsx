import Heading from "@/components/ui/heading";
import { ValueColumn, columns } from "./columns";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import AddValueButton from "./addValuebutton";
import { useSummary } from "@/hooks/use-summary";
import { priceFormatter } from "@/utils/priceFormatter";

interface ClientDataProps {
  data: ValueColumn[];
}

export default function Value({ data }: ClientDataProps) {
  const summary = useSummary();

  return (
    <>
      <div className="flex md:flex-row flex-col space-y-4 md:space-y-0 items-center justify-between pb-4 mt-[-16px] md:mt-0 mb-2 md:mb-0">
        <Heading
          title={`Saldo do cliente: ${priceFormatter.format(summary.total)}`}
          description=""
        />
        <AddValueButton />
      </div>
      <Separator className="md:mb-10 mb-4" />

      <DataTable columns={columns} data={data} />
    </>
  );
}
