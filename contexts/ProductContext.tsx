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
import { ProductColumn } from "@/app/(dashboard)/[storeId]/(routes)/estoque/components/columns";

interface ProductsProviderProps {
  children: ReactNode;
}

interface ProductsContextType {
  products: ProductColumn[];
  loading: boolean;
}
export const ProductsContext = createContext<ProductsContextType>(
  {} as ProductsContextType
);

export function ProductsProvider({ children }: ProductsProviderProps) {
  const [products, setProducts] = useState<ProductColumn[]>([]);
  const params = useParams();
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    try {
      await axios
        .get(`/api/${params.storeId}/stock`)
        .then((response) => {
          setProducts(response.data);
        })
        .catch((err) => {
          toast.error("Produtos não encontradas");
        });
    } catch (err) {
      toast.error("Produtos não encontradas");
    } finally {
      setLoading(false);
    }
  }, [params.stockId]);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading }}>
      {children}
    </ProductsContext.Provider>
  );
}
