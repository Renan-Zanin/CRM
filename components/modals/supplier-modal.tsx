"use client";

import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSupplierModal } from "@/hooks/use-supplier-modal";
import { Modal } from "@/components/ui/modal";
import { useParams, useRouter } from "next/navigation";

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

const formSchema = z.object({
  name: z.string().min(1, { message: "Insira um nome" }),
  phone: z.string(),
  category: z.string(),
  company: z.string(),
});

export function SupplierModal() {
  const params = useParams();

  const supplierModal = useSupplierModal();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      company: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);

      const response = await axios.post(
        `/api/${params.storeId}/suppliers`,
        values
      );

      window.location.assign(`/${params.storeId}/fornecedores`);

      console.log(response.data);

      toast.success("Fornecedor criado com sucesso");
    } catch (err) {
      toast.error("Algo deu errado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      title="Adicionar novo fornecedor"
      description="Adicione um novo fornecedor para a base de dados"
      isOpen={supplierModal.isOpen}
      onClose={supplierModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="(99) 99999-9999"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Categoria"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Empresa</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Empresa"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  disabled={loading}
                  variant="outline"
                  onClick={supplierModal.onClose}
                >
                  Cancelar
                </Button>
                <Button disabled={loading} type="submit">
                  Criar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
}
