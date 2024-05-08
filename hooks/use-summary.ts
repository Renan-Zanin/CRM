import { ValueColumn } from "@/app/(dashboard)/[storeId]/(routes)/clientes/[clientId]/components/columns";
import { TransactionsContext } from "@/contexts/TransactionContext";
import { useContext, useMemo } from "react";

export function useSummary() {
  const { transactions } = useContext(TransactionsContext);

  const summary = useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === "pago") {
          acc.income += parseFloat(transaction.value);
          acc.total += parseFloat(transaction.value);
        } else {
          acc.outcome += parseFloat(transaction.value);
          acc.total -= parseFloat(transaction.value);
        }

        return acc;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      }
    );
  }, [transactions]);
  return summary;
}
