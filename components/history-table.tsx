"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useDataCache } from "@/contexts/DataCacheContext";

interface HistoryTableProps {
  storeId: string;
}

interface HistoryData {
  id: string;
  date: string;
  totalIncoming: number;
  totalOutgoing: number;
  totalProfit: number;
  openingAmount: number;
  closingAmount: number;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ storeId }) => {
  const { state, fetchCashRegisters } = useDataCache();
  const [dateRange, setDateRange] = useState(30);
  const [historyData, setHistoryData] = useState<HistoryData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchCashRegisters(storeId);
  }, [storeId, fetchCashRegisters]);

  useEffect(() => {
    if (state.cashRegisters.length > 0 && mounted) {
      processHistoryData();
    }
  }, [state.cashRegisters, dateRange, mounted]);

  const processHistoryData = () => {
    const endDate = new Date();
    const startDate = subDays(endDate, dateRange);

    const filteredRegisters = state.cashRegisters.filter((register) => {
      const registerDate = new Date(register.openingDate);
      return (
        registerDate >= startOfDay(startDate) &&
        registerDate <= endOfDay(endDate) &&
        !register.isOpen // Apenas caixas fechados
      );
    });

    const dailyTotals: HistoryData[] = [];

    filteredRegisters.forEach((register) => {
      let totalIncoming = 0;
      let totalOutgoing = 0;

      register.transactions?.forEach((transaction: any) => {
        const isDebtTransaction =
          transaction.paymentMethod === "fiado" && transaction.type === "DEVE";

        // Excluir transações fiado DEVE dos cálculos
        if (!isDebtTransaction) {
          if (transaction.type === "incoming") {
            totalIncoming += transaction.amount;
          } else if (transaction.type === "outgoing") {
            totalOutgoing += transaction.amount;
          }
        }
      });

      const totalProfit = totalIncoming - totalOutgoing;
      const closingAmount = register.openingAmount + totalProfit;

      dailyTotals.push({
        id: register.id,
        date: format(new Date(register.openingDate), "dd/MM/yyyy", {
          locale: ptBR,
        }),
        totalIncoming,
        totalOutgoing,
        totalProfit,
        openingAmount: register.openingAmount,
        closingAmount,
      });
    });

    // Ordenar por data (mais recente primeiro)
    dailyTotals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setHistoryData(dailyTotals);
  };

  const getTotalSummary = () => {
    const totalIncoming = historyData.reduce((sum, item) => sum + item.totalIncoming, 0);
    const totalOutgoing = historyData.reduce((sum, item) => sum + item.totalOutgoing, 0);
    const totalProfit = historyData.reduce((sum, item) => sum + item.totalProfit, 0);

    return { totalIncoming, totalOutgoing, totalProfit };
  };

  const summary = getTotalSummary();

  if (!mounted) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Carregando histórico...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">Carregando dados...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
              Total de Entradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {summary.totalIncoming.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">
              Total de Saídas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {summary.totalOutgoing.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle
              className={`text-sm font-medium ${
                summary.totalProfit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              Lucro Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                summary.totalProfit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              R$ {summary.totalProfit.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Fechamentos de Caixa</CardTitle>
          <div className="flex gap-4">
            <Select
              value={dateRange.toString()}
              onValueChange={(value) => setDateRange(parseInt(value))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="15">Últimos 15 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Valor de Abertura</TableHead>
                  <TableHead>Total de Entradas</TableHead>
                  <TableHead>Total de Saídas</TableHead>
                  <TableHead>Lucro</TableHead>
                  <TableHead className="text-right">Valor de Fechamento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historyData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Nenhum fechamento de caixa encontrado no período selecionado.
                    </TableCell>
                  </TableRow>
                ) : (
                  historyData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.date}</TableCell>
                      <TableCell>
                        R$ {item.openingAmount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-green-600">
                        R$ {item.totalIncoming.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-red-600">
                        R$ {item.totalOutgoing.toFixed(2)}
                      </TableCell>
                      <TableCell className={item.totalProfit >= 0 ? "text-green-600" : "text-red-600"}>
                        {item.totalProfit >= 0 ? "+" : ""}R$ {item.totalProfit.toFixed(2)}
                      </TableCell>
                      <TableCell className={`text-right font-medium ${item.closingAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        R$ {item.closingAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
