"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCashRegisterModal } from "@/hooks/use-cash-register-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDataCache } from "@/contexts/DataCacheContext";
import { useParams } from "next/navigation";

const formSchema = z.object({
  openingAmount: z.string().min(1, "Valor de abertura é obrigatório"),
});

export const CashRegisterModal = () => {
  const cashRegisterModal = useCashRegisterModal();
  const [loading, setLoading] = useState(false);
  const { openCashRegister } = useDataCache();
  const params = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      openingAmount: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      await openCashRegister(
        params.storeId as string,
        parseFloat(values.openingAmount)
      );
      toast.success("Caixa aberto com sucesso!");
      cashRegisterModal.onClose();
      form.reset();
    } catch (error) {
      toast.error("Algo deu errado!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Abrir Caixa"
      description="Insira o valor de abertura do caixa"
      isOpen={cashRegisterModal.isOpen}
      onClose={cashRegisterModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="openingAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor de Abertura</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="0.00"
                        type="number"
                        step="0.01"
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
                  onClick={cashRegisterModal.onClose}
                  type="button"
                >
                  Cancelar
                </Button>
                <Button disabled={loading} type="submit">
                  Abrir Caixa
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};
