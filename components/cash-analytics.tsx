"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface CashAnalyticsProps {
  storeId: string;
}

interface ChartData {
  date: string;
  incoming: number;
  outgoing: number;
  profit: number;
}

interface PaymentMethodData {
  method: string;
  value: number;
  color: string;
}

const COLORS = {
  cash: "#0088FE",
  credit_card: "#00C49F",
  debit_card: "#FFBB28",
  pix: "#FF8042",
  fiado: "#8A2BE2",
  fiado_payment: "#FF69B4",
};

const PAYMENT_METHOD_LABELS = {
  cash: "Dinheiro",
  credit_card: "Cartão de Crédito",
  debit_card: "Cartão de Débito",
  pix: "PIX",
  fiado: "Fiado",
  fiado_payment: "Pagamento de Fiado",
};

export const CashAnalytics: React.FC<CashAnalyticsProps> = ({ storeId }) => {
  const { state, fetchCashRegisters } = useDataCache();
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [dateRange, setDateRange] = useState(15);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [paymentMethodData, setPaymentMethodData] = useState<PaymentMethodData[]>([]);
  const [dataFilter, setDataFilter] = useState<"all" | "incoming" | "outgoing" | "profit">("all");

  useEffect(() => {
    fetchCashRegisters(storeId);
  }, [storeId, fetchCashRegisters]);

  useEffect(() => {
    if (state.cashRegisters.length > 0) {
      processChartData();
    }
  }, [state.cashRegisters, dateRange]);

  const processChartData = () => {
    const endDate = new Date();
    const startDate = subDays(endDate, dateRange);
    
    const filteredRegisters = state.cashRegisters.filter((register) => {
      const registerDate = new Date(register.openingDate);
      return (
        registerDate >= startOfDay(startDate) &&
        registerDate <= endOfDay(endDate)
      );
    });

    const dailyData = new Map<
      string,
      { incoming: number; outgoing: number; profit: number }
    >();

    const paymentMethodTotals = new Map<string, number>();

    filteredRegisters.forEach((register) => {
      const registerDate = new Date(register.openingDate);
      const dateKey = format(registerDate, "dd/MM", {
        locale: ptBR,
      });

      if (!dailyData.has(dateKey)) {
        dailyData.set(dateKey, { incoming: 0, outgoing: 0, profit: 0 });
      }

      const dayData = dailyData.get(dateKey)!;
      dayData.incoming += register.totalIncoming || 0;
      dayData.outgoing += register.totalOutgoing || 0;
      dayData.profit += register.profit || 0;

      // Processar métodos de pagamento
      register.transactions?.forEach((transaction: any) => {
        // Filtrar pagamentos de fiado dos gráficos de método de pagamento
        if (transaction.paymentMethod !== 'fiado_payment') {
          const method = transaction.paymentMethod;
          const currentTotal = paymentMethodTotals.get(method) || 0;
          paymentMethodTotals.set(method, currentTotal + transaction.amount);
        }
      });
    });

    // Converter para array para gráficos
    const chartDataArray: ChartData[] = Array.from(dailyData.entries()).map(
      ([date, data]) => ({
        date,
        ...data,
      })
    );

    const paymentMethodArray: PaymentMethodData[] = Array.from(
      paymentMethodTotals.entries()
    ).map(([method, value]) => ({
      method: PAYMENT_METHOD_LABELS[method as keyof typeof PAYMENT_METHOD_LABELS] || method,
      value,
      color: COLORS[method as keyof typeof COLORS] || "#8884d8",
    }));

    setChartData(chartDataArray);
    setPaymentMethodData(paymentMethodArray);
  };

  const renderChart = () => {
    const getFilteredBars = () => {
      const bars = [];
      if (dataFilter === "all" || dataFilter === "incoming") {
        bars.push(<Bar key="incoming" dataKey="incoming" fill="#00C49F" name="Entradas" />);
      }
      if (dataFilter === "all" || dataFilter === "outgoing") {
        bars.push(<Bar key="outgoing" dataKey="outgoing" fill="#FF8042" name="Saídas" />);
      }
      if (dataFilter === "all" || dataFilter === "profit") {
        bars.push(<Bar key="profit" dataKey="profit" fill="#0088FE" name="Lucro" />);
      }
      return bars;
    };

    if (chartType === "pie") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={paymentMethodData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ method, value, percent }) =>
                `${method}: R$ ${value?.toFixed(2)} (${(percent! * 100).toFixed(
                  1
                )}%)`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {paymentMethodData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any) => [
                `R$ ${value.toFixed(2)}`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    const chartProps = {
      width: "100%",
      height: 400,
      data: chartData,
      margin: {
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      },
    };

    if (chartType === "line") {
      return (
        <ResponsiveContainer {...chartProps}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value: any, name: any) => [
                `R$ ${value.toFixed(2)}`,
                name,
              ]}
            />
            <Legend />
            {dataFilter === "all" || dataFilter === "incoming" ? (
              <Line
                type="monotone"
                dataKey="incoming"
                stroke="#00C49F"
                name="Entradas"
              />
            ) : null}
            {dataFilter === "all" || dataFilter === "outgoing" ? (
              <Line
                type="monotone"
                dataKey="outgoing"
                stroke="#FF8042"
                name="Saídas"
              />
            ) : null}
            {dataFilter === "all" || dataFilter === "profit" ? (
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#0088FE"
                name="Lucro"
              />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer {...chartProps}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value: any, name: any) => [
              `R$ ${value.toFixed(2)}`,
              name,
            ]}
          />
          <Legend />
          {getFilteredBars()}
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-4">
      {/* Controles do Gráfico */}
      <Card>
        <CardHeader>
          <CardTitle>Análise de Caixa</CardTitle>
          <div className="flex flex-wrap gap-4 mb-4">
            <Select
              value={chartType}
              onValueChange={(value: "bar" | "line" | "pie") =>
                setChartType(value)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tipo de gráfico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Barras</SelectItem>
                <SelectItem value="line">Linhas</SelectItem>
                <SelectItem value="pie">Pizza (Métodos)</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={dateRange.toString()}
              onValueChange={(value) => setDateRange(parseInt(value))}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 dias</SelectItem>
                <SelectItem value="15">Últimos 15 dias</SelectItem>
                <SelectItem value="30">Últimos 30 dias</SelectItem>
                <SelectItem value="90">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>

            {/* Filtro de dados */}
            <Select
              value={dataFilter}
              onValueChange={(value: "all" | "incoming" | "outgoing" | "profit") =>
                setDataFilter(value)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filtrar dados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="incoming">Apenas Entradas</SelectItem>
                <SelectItem value="outgoing">Apenas Saídas</SelectItem>
                <SelectItem value="profit">Apenas Lucro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>{renderChart()}</CardContent>
      </Card>
    </div>
  );
};
