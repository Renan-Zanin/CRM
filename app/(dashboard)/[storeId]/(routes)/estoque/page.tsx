"use client";

import Supplier from "./components/product";
import { useContext } from "react";
import { ProductsContext } from "@/contexts/ProductContext";
import { ProductColumn } from "./components/columns";
import { priceFormatter } from "@/utils/priceFormatter";

export default function SupplierPage() {
  const { products } = useContext(ProductsContext);

  const formattedProduct: ProductColumn[] = products.map((product) => ({
    sellPrice: priceFormatter.format(product.sellPrice),
    code: product.code,
    name: product.name,
    brand: product.brand,
    quantity: product.quantity,
    id: product.id,
  }));

  return (
    <div className="container mx-auto py-10">
      <Supplier data={formattedProduct} />
    </div>
  );
}
