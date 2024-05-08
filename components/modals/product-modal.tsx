"use client";

import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-hot-toast";
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
import { useProductModal } from "@/hooks/use-product-modal";

const transformarNumero = (str: string) => {
  const strSemEspacos = str.replace(/\s/g, ""); // Remover espaços em branco
  const strComPonto = strSemEspacos.replace(",", "."); // Substituir ',' por '.'

  return parseFloat(strComPonto);
};

const formSchema = z.object({
  code: z.string(),
  name: z.string().min(1, { message: "Insira um nome" }),
  brand: z.string(),
  quantity: z.string().transform((v) => Number(v) || 0),
  sellPrice: z
    .string()
    .transform(transformarNumero)
    .refine((num) => !isNaN(num), {
      message: "Número inválido",
    }),
});

export function ProductModal() {
  const params = useParams();

  const productModal = useProductModal();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);

      const response = await axios.post(`/api/${params.storeId}/stock`, values);

      window.location.assign(`/${params.storeId}/estoque`);

      console.log(response.data);

      toast.success("Produto criado com sucesso");
    } catch (err) {
      toast.error("Algo deu errado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      title="Adicionar novo produto"
      description="Adicione um novo produto para a base de dados"
      isOpen={productModal.isOpen}
      onClose={productModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Código"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Marca"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Quantidade"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sellPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço de venda</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Preço de venda"
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
                  onClick={productModal.onClose}
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
