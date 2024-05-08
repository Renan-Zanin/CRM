"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { Product } from "@prisma/client";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import AlertModal from "@/components/modals/alert-modal";

interface ProductFormProps {
  initialData: Product | null;
}

const formSchema = z.object({
  code: z.string(),
  name: z.string().min(1, { message: "Insira um nome" }),
  brand: z.string(),
  quantity: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number()),
  sellPrice: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number()),
});

type ProductFormValues = z.infer<typeof formSchema>;

export default function StockForm({ initialData }: ProductFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Editar produto" : "Criar produto";
  const description = initialData ? "Editar produto" : "Adicionar produto";
  const toastMessage = initialData
    ? "Fonecedor atualizado"
    : "Fonecedor criado";
  const action = initialData ? "Salvar alterações" : "Criar";

  const params = useParams();
  const router = useRouter();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      code: "",
      name: "",
      brand: "",
      quantity: 0,
      sellPrice: 0,
    },
  });

  async function onSubmit(data: ProductFormValues) {
    try {
      setLoading(true);
      if (initialData) {
        await axios.put(`/api/${params.storeId}/stock/${params.stockId}`, data);
      } else {
        await axios.post(
          `/api/${params.storeId}/stock/${params.stockId}`,
          data
        );
      }
      router.push(`/${params.storeId}/estoque`);
      router.refresh();
      toast.success(toastMessage);
    } catch (err) {
      toast.error("Algo deu errado");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete() {
    try {
      setLoading(true);

      await axios.delete(`/api/${params.storeId}/stock/${params.stockId}`);
      router.refresh();
      router.push(`/${params.storeId}/estoque`);
      toast.success("Produto excluído com sucesso");
    } catch (err) {
      toast.error("Não foi possível excluir o produto");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <div className="flex- col">
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between mb-4">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
            disabled={loading}
          >
            <Trash className="h4- w-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full my-4"
        >
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Código" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <>
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
            </>
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </div>
  );
}
