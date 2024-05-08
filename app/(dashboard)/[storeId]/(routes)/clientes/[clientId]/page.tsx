"use client";

import ClientHeading from "@/components/ui/client-heading";
import ClientTransactions from "./components/client-transactions";

export default function ClientPage() {
  return (
    <div className="container mx-auto py-10">
      <ClientHeading />
      <ClientTransactions />
    </div>
  );
}
