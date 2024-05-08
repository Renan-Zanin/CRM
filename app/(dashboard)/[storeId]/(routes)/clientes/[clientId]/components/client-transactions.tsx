"use client";

import { useContext } from "react";
import Value from "./value";
import Loading from "@/components/ui/loading";
import { TransactionsContext } from "@/contexts/TransactionContext";
import { ValueColumn } from "./columns";
import { priceFormatter } from "@/utils/priceFormatter";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TransactionsTable {
  id: string;
  clientId: string;
  value: string;
  type: string;
  createdAt: string;
}

export default function ClientTransactions() {
  const { transactions } = useContext(TransactionsContext);

  const formatedTransactions: TransactionsTable[] = transactions.map(
    (transaction) => ({
      type: transaction.type.toLocaleUpperCase(),
      value: priceFormatter.format(parseFloat(transaction.value)),
      id: transaction.id,
      clientId: transaction.clientId,
      createdAt: format(new Date(transaction.createdAt), "d/MM/yyyy HH:MM", {
        locale: ptBR,
      }),
    })
  );

  return (
    <div className="mt-10 mx-auto">
      <Value data={formatedTransactions} />
    </div>
  );
}
