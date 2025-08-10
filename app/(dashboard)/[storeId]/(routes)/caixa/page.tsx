"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import { CashRegisterModal } from "@/components/modals/cash-register-modal";
import { TransactionModal } from "@/components/modals/cash-transaction-modal";
import { EditTransactionModal } from "@/components/modals/edit-transaction-modal";
import { CashAnalytics } from "@/components/cash-analytics";
import { useCashRegisterModal } from "@/hooks/use-cash-register-modal";
import { useTransactionModal } from "@/hooks/useTransactionModal";
import { useEditTransactionModal } from "@/hooks/use-edit-transaction-modal";
import { useDataCache } from "@/contexts/DataCacheContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import toast from "react-hot-toast";

interface CashRegisterPageProps {
  params: {
    storeId: string;
  };
}

export default function CashRegisterPage({ params }: CashRegisterPageProps) {
  const [currentCashRegister, setCurrentCashRegister] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const cashRegisterModal = useCashRegisterModal();
  const transactionModal = useTransactionModal();
  const editTransactionModal = useEditTransactionModal();
  const {
    state,
    fetchCashRegisters,
    fetchTransactions,
    closeCashRegister,
    deleteTransaction,
  } = useDataCache();

  useEffect(() => {
    loadData();
  }, [params.storeId]);

  useEffect(() => {
    // Encontrar o caixa aberto atual
    const openCashRegister = state.cashRegisters.find(
      (register) => register.isOpen
    );
    setCurrentCashRegister(openCashRegister);

    if (openCashRegister) {
      fetchTransactions(openCashRegister.id);
    }
  }, [state.cashRegisters]);

  useEffect(() => {
    setTransactions(state.transactions);
  }, [state.transactions]);

  const loadData = async () => {
    try {
      setLoading(true);
      await fetchCashRegisters(params.storeId, true);
    } catch (error) {
      toast.error("Erro ao carregar dados do caixa");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseCashRegister = async () => {
    if (!currentCashRegister) return;

    try {
      setLoading(true);
      await closeCashRegister(params.storeId, currentCashRegister.id);
      toast.success("Caixa fechado com sucesso!");
      await loadData();
    } catch (error) {
      toast.error("Erro ao fechar caixa");
    } finally {
      setLoading(false);
    }
  };

  const handleEditTransaction = (transaction: any) => {
    editTransactionModal.onOpen(transaction);
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!currentCashRegister) return;

    if (!confirm("Tem certeza que deseja deletar esta transação?")) {
      return;
    }

    try {
      setLoading(true);
      await deleteTransaction(currentCashRegister.id, transactionId);
      toast.success("Transação deletada com sucesso!");
    } catch (error) {
      toast.error("Erro ao deletar transação");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const incoming = transactions
      .filter((t) => t.type === "incoming")
      .reduce((sum, t) => sum + t.amount, 0);

    const outgoing = transactions
      .filter((t) => t.type === "outgoing")
      .reduce((sum, t) => sum + t.amount, 0);

    // Transações fiado_pending não entram no cálculo de totais
    // mas ficam registradas para o gráfico de métodos de pagamento

    const currentTotal = currentCashRegister
      ? currentCashRegister.openingAmount + incoming - outgoing
      : 0;

    return { incoming, outgoing, currentTotal };
  };

  const { incoming, outgoing, currentTotal } = calculateTotals();

  const paymentMethodLabels = {
    cash: "Dinheiro",
    credit_card: "Cartão de Crédito",
    debit_card: "Cartão de Débito",
    pix: "PIX",
    fiado: "Fiado",
    fiado_payment: "Pagamento de Fiado",
  };

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title="Gerenciamento de Caixa"
            description="Controle de entradas e saídas do caixa"
          />
          {!currentCashRegister ? (
            <Button onClick={cashRegisterModal.onOpen}>
              <Plus className="mr-2 h-4 w-4" />
              Abrir Caixa
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={transactionModal.onOpen}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Transação
              </Button>
              <Button
                variant="destructive"
                onClick={handleCloseCashRegister}
                disabled={loading}
              >
                Fechar Caixa
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {!currentCashRegister ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhum caixa aberto
              </h3>
              <p className="text-muted-foreground mb-4">
                Para começar a registrar transações, abra um novo caixa.
              </p>
              <Button onClick={cashRegisterModal.onOpen}>
                <Plus className="mr-2 h-4 w-4" />
                Abrir Caixa
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Cards de Status do Caixa Atual */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Valor de Abertura
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {currentCashRegister.openingAmount.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Aberto em{" "}
                    {format(
                      new Date(currentCashRegister.openingDate),
                      "dd/MM/yyyy 'às' HH:mm",
                      { locale: ptBR }
                    )}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Entradas
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    R$ {incoming.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {transactions.filter((t) => t.type === "incoming").length}{" "}
                    transações
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Saídas
                  </CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    R$ {outgoing.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {transactions.filter((t) => t.type === "outgoing").length}{" "}
                    transações
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total em Caixa
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-2xl font-bold ${
                      currentTotal >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    R$ {currentTotal.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">Valor atual</p>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Transações */}
            <Card>
              <CardHeader>
                <CardTitle>Transações do Dia</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Nenhuma transação registrada ainda.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-2 rounded-full ${
                              transaction.type === "incoming"
                                ? "bg-green-100 text-green-600"
                                : transaction.type === "fiado_pending"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {transaction.type === "incoming" ? (
                              <TrendingUp className="h-4 w-4" />
                            ) : transaction.type === "fiado_pending" ? (
                              <DollarSign className="h-4 w-4" />
                            ) : (
                              <TrendingDown className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              {transaction.type === "incoming"
                                ? "Entrada"
                                : transaction.type === "fiado_pending"
                                ? "Fiado Pendente"
                                : "Saída"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {
                                paymentMethodLabels[
                                  transaction.paymentMethod as keyof typeof paymentMethodLabels
                                ]
                              }
                              {transaction.description &&
                                ` • ${transaction.description}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(
                                new Date(transaction.createdAt),
                                "HH:mm",
                                { locale: ptBR }
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div
                            className={`text-lg font-semibold ${
                              transaction.type === "incoming"
                                ? "text-green-600"
                                : transaction.type === "fiado_pending"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.type === "incoming"
                              ? "+"
                              : transaction.type === "fiado_pending"
                              ? "⏳"
                              : "-"}
                            R$ {transaction.amount.toFixed(2)}
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditTransaction(transaction)}
                              disabled={loading}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDeleteTransaction(transaction.id)
                              }
                              disabled={loading}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Gráficos de Análise */}
        <CashAnalytics storeId={params.storeId} />
      </div>

      <CashRegisterModal />
      <TransactionModal cashRegisterId={currentCashRegister?.id} mode="cash" />
      <EditTransactionModal cashRegisterId={currentCashRegister?.id} />
    </div>
  );
}
