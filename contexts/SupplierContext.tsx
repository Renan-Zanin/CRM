"use client";

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
import { SupplierColumn } from "@/app/(dashboard)/[storeId]/(routes)/fornecedores/components/columns";

interface SuppliersProviderProps {
  children: ReactNode;
}

interface SuppliersContextType {
  suppliers: SupplierColumn[];
  loading: boolean;
}
export const SuppliersContext = createContext<SuppliersContextType>(
  {} as SuppliersContextType
);

export function SuppliersProvider({ children }: SuppliersProviderProps) {
  const [suppliers, setSuppliers] = useState<SupplierColumn[]>([]);
  const params = useParams();
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = useCallback(async () => {
    try {
      await axios
        .get(`/api/${params.storeId}/suppliers`)
        .then((response) => {
          setSuppliers(response.data);
        })
        .catch((err) => {
          toast.error("Fornecedores não encontradas");
        });
    } catch (err) {
      toast.error("Fornecedores não encontradas");
    } finally {
      setLoading(false);
    }
  }, [params.clientId]);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  return (
    <SuppliersContext.Provider value={{ suppliers, loading }}>
      {children}
    </SuppliersContext.Provider>
  );
}
