"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CashAnalytics } from "@/components/cash-analytics";
import { HistoryTable } from "@/components/history-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "next/navigation";

export default function HistoricoPage() {
  const params = useParams();
  const [viewMode, setViewMode] = useState<"table" | "charts">("table");

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Histórico</h2>
          <Select
            value={viewMode}
            onValueChange={(value: "table" | "charts") => setViewMode(value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Modo de visualização" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="table">Tabela</SelectItem>
              <SelectItem value="charts">Gráficos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {viewMode === "table" ? (
          <HistoryTable storeId={params.storeId as string} />
        ) : (
          <CashAnalytics storeId={params.storeId as string} />
        )}
      </div>
    </div>
  );
}
