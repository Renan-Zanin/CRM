"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";

interface CacheState {
  clients: any[];
  products: any[];
  suppliers: any[];
  cashRegisters: any[];
  transactions: any[];
  lastSync: {
    clients: number;
    products: number;
    suppliers: number;
    cashRegisters: number;
    transactions: number;
  };
  loading: {
    clients: boolean;
    products: boolean;
    suppliers: boolean;
    cashRegisters: boolean;
    transactions: boolean;
  };
}

type CacheAction =
  | {
      type: "SET_LOADING";
      payload: { entity: keyof CacheState["loading"]; loading: boolean };
    }
  | {
      type: "SET_DATA";
      payload: {
        entity: keyof Omit<CacheState, "lastSync" | "loading">;
        data: any[];
      };
    }
  | {
      type: "ADD_ITEM";
      payload: {
        entity: keyof Omit<CacheState, "lastSync" | "loading">;
        item: any;
      };
    }
  | {
      type: "UPDATE_ITEM";
      payload: {
        entity: keyof Omit<CacheState, "lastSync" | "loading">;
        id: string;
        item: any;
      };
    }
  | {
      type: "DELETE_ITEM";
      payload: {
        entity: keyof Omit<CacheState, "lastSync" | "loading">;
        id: string;
      };
    }
  | {
      type: "UPDATE_SYNC_TIME";
      payload: { entity: keyof CacheState["lastSync"] };
    };

const initialState: CacheState = {
  clients: [],
  products: [],
  suppliers: [],
  cashRegisters: [],
  transactions: [],
  lastSync: {
    clients: 0,
    products: 0,
    suppliers: 0,
    cashRegisters: 0,
    transactions: 0,
  },
  loading: {
    clients: false,
    products: false,
    suppliers: false,
    cashRegisters: false,
    transactions: false,
  },
};

function cacheReducer(state: CacheState, action: CacheAction): CacheState {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.entity]: action.payload.loading,
        },
      };
    case "SET_DATA":
      return {
        ...state,
        [action.payload.entity]: action.payload.data,
      };
    case "ADD_ITEM":
      return {
        ...state,
        [action.payload.entity]: [
          ...state[action.payload.entity],
          action.payload.item,
        ],
      };
    case "UPDATE_ITEM":
      return {
        ...state,
        [action.payload.entity]: state[action.payload.entity].map((item: any) =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.item }
            : item
        ),
      };
    case "DELETE_ITEM":
      return {
        ...state,
        [action.payload.entity]: state[action.payload.entity].filter(
          (item: any) => item.id !== action.payload.id
        ),
      };
    case "UPDATE_SYNC_TIME":
      return {
        ...state,
        lastSync: {
          ...state.lastSync,
          [action.payload.entity]: Date.now(),
        },
      };
    default:
      return state;
  }
}

interface DataCacheContextType {
  state: CacheState;
  fetchClients: (storeId: string, force?: boolean) => Promise<void>;
  fetchProducts: (storeId: string, force?: boolean) => Promise<void>;
  fetchSuppliers: (storeId: string, force?: boolean) => Promise<void>;
  fetchCashRegisters: (storeId: string, force?: boolean) => Promise<void>;
  fetchTransactions: (cashRegisterId: string, force?: boolean) => Promise<void>;
  addClient: (storeId: string, client: any) => Promise<any>;
  updateClient: (storeId: string, id: string, client: any) => Promise<any>;
  deleteClient: (storeId: string, id: string) => Promise<void>;
  addProduct: (storeId: string, product: any) => Promise<any>;
  updateProduct: (storeId: string, id: string, product: any) => Promise<any>;
  deleteProduct: (storeId: string, id: string) => Promise<void>;
  addSupplier: (storeId: string, supplier: any) => Promise<any>;
  updateSupplier: (storeId: string, id: string, supplier: any) => Promise<any>;
  deleteSupplier: (storeId: string, id: string) => Promise<void>;
  openCashRegister: (storeId: string, openingAmount: number) => Promise<any>;
  closeCashRegister: (storeId: string, cashRegisterId: string) => Promise<any>;
  addTransaction: (cashRegisterId: string, transaction: any) => Promise<any>;
  updateTransaction: (cashRegisterId: string, transactionId: string, transaction: any) => Promise<any>;
  deleteTransaction: (cashRegisterId: string, transactionId: string) => Promise<void>;
}

const DataCacheContext = createContext<DataCacheContextType | undefined>(
  undefined
);

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export function DataCacheProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cacheReducer, initialState);

  const shouldFetch = useCallback(
    (entity: keyof CacheState["lastSync"], force = false) => {
      if (force) return true;
      const lastSync = state.lastSync[entity];
      return Date.now() - lastSync > CACHE_DURATION;
    },
    [state.lastSync]
  );

  const fetchClients = useCallback(
    async (storeId: string, force = false) => {
      if (!shouldFetch("clients", force)) return;

      dispatch({
        type: "SET_LOADING",
        payload: { entity: "clients", loading: true },
      });
      try {
        const response = await axios.get(`/api/${storeId}/clients`);
        dispatch({
          type: "SET_DATA",
          payload: { entity: "clients", data: response.data },
        });
        dispatch({ type: "UPDATE_SYNC_TIME", payload: { entity: "clients" } });
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      } finally {
        dispatch({
          type: "SET_LOADING",
          payload: { entity: "clients", loading: false },
        });
      }
    },
    [shouldFetch]
  );

  const fetchProducts = useCallback(
    async (storeId: string, force = false) => {
      if (!shouldFetch("products", force)) return;

      dispatch({
        type: "SET_LOADING",
        payload: { entity: "products", loading: true },
      });
      try {
        const response = await axios.get(`/api/${storeId}/stock`);
        dispatch({
          type: "SET_DATA",
          payload: { entity: "products", data: response.data },
        });
        dispatch({ type: "UPDATE_SYNC_TIME", payload: { entity: "products" } });
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        dispatch({
          type: "SET_LOADING",
          payload: { entity: "products", loading: false },
        });
      }
    },
    [shouldFetch]
  );

  const fetchSuppliers = useCallback(
    async (storeId: string, force = false) => {
      if (!shouldFetch("suppliers", force)) return;

      dispatch({
        type: "SET_LOADING",
        payload: { entity: "suppliers", loading: true },
      });
      try {
        const response = await axios.get(`/api/${storeId}/suppliers`);
        dispatch({
          type: "SET_DATA",
          payload: { entity: "suppliers", data: response.data },
        });
        dispatch({
          type: "UPDATE_SYNC_TIME",
          payload: { entity: "suppliers" },
        });
      } catch (error) {
        console.error("Erro ao buscar fornecedores:", error);
      } finally {
        dispatch({
          type: "SET_LOADING",
          payload: { entity: "suppliers", loading: false },
        });
      }
    },
    [shouldFetch]
  );

  const fetchCashRegisters = useCallback(
    async (storeId: string, force = false) => {
      if (!shouldFetch("cashRegisters", force)) return;

      dispatch({
        type: "SET_LOADING",
        payload: { entity: "cashRegisters", loading: true },
      });
      try {
        const response = await axios.get(`/api/${storeId}/cash-register`);
        dispatch({
          type: "SET_DATA",
          payload: { entity: "cashRegisters", data: response.data },
        });
        dispatch({
          type: "UPDATE_SYNC_TIME",
          payload: { entity: "cashRegisters" },
        });
      } catch (error) {
        console.error("Erro ao buscar caixas:", error);
      } finally {
        dispatch({
          type: "SET_LOADING",
          payload: { entity: "cashRegisters", loading: false },
        });
      }
    },
    [shouldFetch]
  );

  const fetchTransactions = useCallback(
    async (cashRegisterId: string, force = false) => {
      if (!shouldFetch("transactions", force)) return;

      dispatch({
        type: "SET_LOADING",
        payload: { entity: "transactions", loading: true },
      });
      try {
        const response = await axios.get(
          `/api/cash-register/${cashRegisterId}/transactions`
        );
        dispatch({
          type: "SET_DATA",
          payload: { entity: "transactions", data: response.data },
        });
        dispatch({
          type: "UPDATE_SYNC_TIME",
          payload: { entity: "transactions" },
        });
      } catch (error) {
        console.error("Erro ao buscar transações:", error);
      } finally {
        dispatch({
          type: "SET_LOADING",
          payload: { entity: "transactions", loading: false },
        });
      }
    },
    [shouldFetch]
  );

  // CRUD Clients
  const addClient = useCallback(async (storeId: string, client: any) => {
    try {
      const response = await axios.post(`/api/${storeId}/clients`, client);
      dispatch({
        type: "ADD_ITEM",
        payload: { entity: "clients", item: response.data },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      throw error;
    }
  }, []);

  const updateClient = useCallback(
    async (storeId: string, id: string, client: any) => {
      try {
        const response = await axios.patch(
          `/api/${storeId}/clients/${id}`,
          client
        );
        dispatch({
          type: "UPDATE_ITEM",
          payload: { entity: "clients", id, item: response.data },
        });
        return response.data;
      } catch (error) {
        console.error("Erro ao atualizar cliente:", error);
        throw error;
      }
    },
    []
  );

  const deleteClient = useCallback(async (storeId: string, id: string) => {
    try {
      await axios.delete(`/api/${storeId}/clients/${id}`);
      dispatch({ type: "DELETE_ITEM", payload: { entity: "clients", id } });
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      throw error;
    }
  }, []);

  // CRUD Products
  const addProduct = useCallback(async (storeId: string, product: any) => {
    try {
      const response = await axios.post(`/api/${storeId}/stock`, product);
      dispatch({
        type: "ADD_ITEM",
        payload: { entity: "products", item: response.data },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      throw error;
    }
  }, []);

  const updateProduct = useCallback(
    async (storeId: string, id: string, product: any) => {
      try {
        const response = await axios.patch(
          `/api/${storeId}/stock/${id}`,
          product
        );
        dispatch({
          type: "UPDATE_ITEM",
          payload: { entity: "products", id, item: response.data },
        });
        return response.data;
      } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        throw error;
      }
    },
    []
  );

  const deleteProduct = useCallback(async (storeId: string, id: string) => {
    try {
      await axios.delete(`/api/${storeId}/stock/${id}`);
      dispatch({ type: "DELETE_ITEM", payload: { entity: "products", id } });
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      throw error;
    }
  }, []);

  // CRUD Suppliers
  const addSupplier = useCallback(async (storeId: string, supplier: any) => {
    try {
      const response = await axios.post(`/api/${storeId}/suppliers`, supplier);
      dispatch({
        type: "ADD_ITEM",
        payload: { entity: "suppliers", item: response.data },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar fornecedor:", error);
      throw error;
    }
  }, []);

  const updateSupplier = useCallback(
    async (storeId: string, id: string, supplier: any) => {
      try {
        const response = await axios.patch(
          `/api/${storeId}/suppliers/${id}`,
          supplier
        );
        dispatch({
          type: "UPDATE_ITEM",
          payload: { entity: "suppliers", id, item: response.data },
        });
        return response.data;
      } catch (error) {
        console.error("Erro ao atualizar fornecedor:", error);
        throw error;
      }
    },
    []
  );

  const deleteSupplier = useCallback(async (storeId: string, id: string) => {
    try {
      await axios.delete(`/api/${storeId}/suppliers/${id}`);
      dispatch({ type: "DELETE_ITEM", payload: { entity: "suppliers", id } });
    } catch (error) {
      console.error("Erro ao deletar fornecedor:", error);
      throw error;
    }
  }, []);

  // Cash Register Operations
  const openCashRegister = useCallback(
    async (storeId: string, openingAmount: number) => {
      try {
        const response = await axios.post(`/api/${storeId}/cash-register`, {
          openingAmount,
        });
        dispatch({
          type: "ADD_ITEM",
          payload: { entity: "cashRegisters", item: response.data },
        });
        return response.data;
      } catch (error) {
        console.error("Erro ao abrir caixa:", error);
        throw error;
      }
    },
    []
  );

  const closeCashRegister = useCallback(
    async (storeId: string, cashRegisterId: string) => {
      try {
        const response = await axios.patch(
          `/api/${storeId}/cash-register/${cashRegisterId}/close`
        );
        dispatch({
          type: "UPDATE_ITEM",
          payload: {
            entity: "cashRegisters",
            id: cashRegisterId,
            item: response.data,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Erro ao fechar caixa:", error);
        throw error;
      }
    },
    []
  );

  const addTransaction = useCallback(
    async (cashRegisterId: string, transaction: any) => {
      try {
        const response = await axios.post(
          `/api/cash-register/${cashRegisterId}/transactions`,
          transaction
        );
        dispatch({
          type: "ADD_ITEM",
          payload: { entity: "transactions", item: response.data },
        });
        return response.data;
      } catch (error) {
        console.error("Erro ao adicionar transação:", error);
        throw error;
      }
    },
    []
  );

  const updateTransaction = useCallback(
    async (cashRegisterId: string, transactionId: string, transaction: any) => {
      try {
        const response = await axios.patch(
          `/api/cash-register/${cashRegisterId}/transactions/${transactionId}`,
          transaction
        );
        dispatch({
          type: "UPDATE_ITEM",
          payload: { entity: "transactions", id: transactionId, item: response.data },
        });
        return response.data;
      } catch (error) {
        console.error("Erro ao atualizar transação:", error);
        throw error;
      }
    },
    []
  );

  const deleteTransaction = useCallback(
    async (cashRegisterId: string, transactionId: string) => {
      try {
        await axios.delete(
          `/api/cash-register/${cashRegisterId}/transactions/${transactionId}`
        );
        dispatch({
          type: "DELETE_ITEM",
          payload: { entity: "transactions", id: transactionId },
        });
      } catch (error) {
        console.error("Erro ao deletar transação:", error);
        throw error;
      }
    },
    []
  );

  return (
    <DataCacheContext.Provider
      value={{
        state,
        fetchClients,
        fetchProducts,
        fetchSuppliers,
        fetchCashRegisters,
        fetchTransactions,
        addClient,
        updateClient,
        deleteClient,
        addProduct,
        updateProduct,
        deleteProduct,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        openCashRegister,
        closeCashRegister,
        addTransaction,
        updateTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </DataCacheContext.Provider>
  );
}

export function useDataCache() {
  const context = useContext(DataCacheContext);
  if (context === undefined) {
    throw new Error(
      "useDataCache deve ser usado dentro de um DataCacheProvider"
    );
  }
  return context;
}

export function useDataCacheSafe() {
  const context = useContext(DataCacheContext);
  return context;
}
