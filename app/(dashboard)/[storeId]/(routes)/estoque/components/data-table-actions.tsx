import { type Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import AlertModal from "@/components/modals/alert-modal";
import axios from "axios";
import toast from "react-hot-toast";
import { ProductColumn } from "./columns";
import { useState } from "react";
import { Trash } from "lucide-react";

interface DataTableActionsProps<TData>
  extends React.HTMLAttributes<HTMLElement> {
  table: Table<TData>;
}

export function DataTableActions<TData>({
  table,
  ...props
}: DataTableActionsProps<TData>) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  function deleteSelectedRow(table: Table<TData>) {
    const selectedRows = table.getFilteredSelectedRowModel()
      .rows as unknown as { original: ProductColumn }[];

    selectedRows.map(async (row) => {
      try {
        setLoading(true);

        await axios.delete(`/api/stock/${row.original.id}`);
        toast.success("Produto(s) deletado(s) com sucesso");
        window.location.assign(`/estoque`);
      } catch (err) {
        toast.error("Não foi possível excluir o(s) produto(s)");
      } finally {
        setLoading(false);
        setOpen(false);
      }
    });
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => deleteSelectedRow(table)}
        loading={loading}
      />
      <div className="align-center justify-center">
        Apagar linhas selecionadas
        <Button
          onClick={() => setOpen(true)}
          variant="destructive"
          size="icon"
          disabled={table.getFilteredSelectedRowModel().rows.length <= 0}
          className="ml-4"
        >
          <Trash className="m-2 h-4 w-4" />
        </Button>
      </div>
    </>
  );
}
