"use client";

import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Modal } from "@/components/ui/modal";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchProductModal } from "@/hooks/use-search-product-modal";
import { Search } from "lucide-react";
import prismadb from "@/lib/prismadb";
import { SearchColumn, columns } from "./components/columns";
import { DataTable } from "./components/data-table";

const formSchema = z.object({
  name: z.string().min(1, { message: "Insira um nome" }),
});

export function SearchProductModal() {
  const searchProductModal = useSearchProductModal();

  const [loading, setLoading] = useState(false);
  const [term, setTerm] = useState<SearchColumn>({ code: "", name: "" });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setLoading(true);

      const response = await axios.get(`/api/search?term=${data.name}`);
      setTerm(
        response.data.map((searchProduct: SearchColumn) => searchProduct)
      );
    } catch (err) {
      toast.error("Algo deu errado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      title="Procurar por produto"
      description="Procure por um produto na base de dados"
      isOpen={searchProductModal.isOpen}
      onClose={searchProductModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do produto</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Nome do produto"
                        {...form.register("name")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={loading} type="submit">
                  <Search size={24} />
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
      <div>
        <DataTable columns={columns} data={term} />
      </div>
      <Button
        disabled={loading}
        variant="outline"
        onClick={searchProductModal.onClose}
      >
        Cancelar
      </Button>
    </Modal>
  );
}
