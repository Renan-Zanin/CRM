"use client";

import { ValueColumn } from "@/app/(dashboard)/[storeId]/(routes)/clientes/[clientId]/components/columns";
import axios from "axios";
import {
  ReactNode,
  useEffect,
  useState,
  useCallback,
  createContext,
} from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

interface TransactionsProviderProps {
  children: ReactNode;
}

interface TransactionContextType {
  transactions: ValueColumn[];
  fetchTransactions: (query?: string) => Promise<void>;
  loading: boolean;
}

export const TransactionsContext = createContext<TransactionContextType>(
  {} as TransactionContextType
);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<ValueColumn[]>([]);
  const params = useParams();
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      await axios
        .get(`/api/${params.storeId}/clients/${params.clientId}/transaction`)
        .then((response) => {
          const sortedTransactions = response.data.sort(
            (a: ValueColumn, b: ValueColumn) => {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            }
          );
          setTransactions(sortedTransactions);
        })
        .catch((err) => {
          toast.error("Transações não encontradas");
        });
    } catch (err) {
      toast.error("Transações não encontradas");
    } finally {
      setLoading(false);
    }
  }, [params.clientId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <TransactionsContext.Provider
      value={{ transactions, fetchTransactions, loading }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}
