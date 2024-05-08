"use client";

import { useParams, useRouter } from "next/navigation";
import { ClientColumn } from "./columns";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import AlertModal from "@/components/modals/alert-modal";

interface CellActionProps {
  data: ClientColumn;
}

export default function CellAction({ data }: CellActionProps) {
  const params = useParams();
  const router = useRouter();

  return (
    <div className="flex items-start">
      <Button
        onClick={() => router.push(`/${params.storeId}/clientes/${data.id}`)}
        variant="link"
      >
        {data.name}
      </Button>
    </div>
  );
}
