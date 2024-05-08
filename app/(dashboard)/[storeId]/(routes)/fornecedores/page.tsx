"use client";

import { SupplierColumn } from "./components/columns";
import { telephoneFormatter } from "@/utils/phoneFormater";
import Supplier from "./components/supplier";
import { SuppliersContext } from "@/contexts/SupplierContext";
import { useContext } from "react";

export default function SupplierPage() {
  const { suppliers } = useContext(SuppliersContext);

  const formatedSuppliers: SupplierColumn[] = suppliers.map((supplier) => ({
    id: supplier.id,
    name: supplier.name.toLocaleUpperCase(),
    phone: telephoneFormatter(supplier.phone),
    category: supplier.category.toLocaleUpperCase(),
    company: supplier.company.toLocaleUpperCase(),
  }));

  return (
    <div className="container mx-auto py-10">
      <Supplier data={formatedSuppliers} />
    </div>
  );
}
