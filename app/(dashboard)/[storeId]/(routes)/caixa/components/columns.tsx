"use client";

import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";

export type SaleColumn = {
  id: string;
  productCod: string;
  name: string;
  qtd: number;
  unitValue: number;
  productValue: number;
};

export const columns: ColumnDef<SaleColumn>[] = [
  {
    accessorKey: "productCod",
    header: "Código",
  },
  {
    accessorKey: "name",
    header: "Produto",
  },
  {
    accessorKey: "qtd",
    header: "QTD",
  },
  {
    accessorKey: "unitValue",
    header: "Valor unitário",
  },
  {
    accessorKey: "productValue",
    header: "Valor total",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
