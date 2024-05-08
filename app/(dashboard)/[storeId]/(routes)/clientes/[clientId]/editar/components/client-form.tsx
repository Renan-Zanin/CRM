"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { Client } from "@prisma/client";
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

interface ClientFormProps {
  initialData: Client | null;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Insira um nome" }),
  phone: z.string(),
});

type ClientFormValues = z.infer<typeof formSchema>;

export default function ClientForm({ initialData }: ClientFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Editar cliente" : "Criar cliente";
  const toastMessage = initialData ? "client atualizado" : "client criado";
  const action = initialData ? "Salvar alterações" : "Criar";

  const params = useParams();
  const router = useRouter();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
    },
  });

  async function onSubmit(data: ClientFormValues) {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/clients/${params.clientId}`,
          data
        );
      } else {
        await axios.post(
          `/api/${params.storeId}/clients/${params.clientId}`,
          data
        );
      }
      router.refresh();
      router.push(`/${params.storeId}/clientes`);
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

      await axios.delete(`/api/${params.storeId}/clients/${params.clientId}`);
      router.refresh();
      router.push(`/${params.storeId}/clientes`);
      toast.success("Cliente excluído com sucesso");
    } catch (err) {
      toast.error("Não foi possível excluir o cliente");
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
        <Heading title={title} description="" />
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
          <div className="flex gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Telefone"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </div>
  );
}
