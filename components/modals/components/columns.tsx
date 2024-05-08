"use client";

import { ColumnDef } from "@tanstack/react-table";

export type SearchColumn = {
  code: string;
  name: string;
};

export const columns: ColumnDef<SearchColumn>[] = [
  {
    accessorKey: "code",
    header: "Código",
  },
  {
    accessorKey: "name",
    header: "Produto",
  },
];
