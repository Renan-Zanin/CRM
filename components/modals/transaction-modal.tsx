"use client";

import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
import { useTransactionModal } from "@/hooks/useTransactionModal";
import { useParams } from "next/navigation";

const formSchema = z.object({
  value: z
    .string()
    .refine((value) => !isNaN(Number(value)), {
      message: "Por favor, insira um número válido.",
    })
    .transform((value) => Number(value)),
  type: z.enum(["pago", "deve"], {
    required_error: "Selecione um tipo de transação",
  }),
});

type NewTransactionFormInput = z.infer<typeof formSchema>;

export function TransactionModal() {
  const transactionModal = useTransactionModal();

  const params = useParams();

  const [loading, setLoading] = useState(false);

  const form = useForm<NewTransactionFormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "deve",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setLoading(true);

      const response = await axios.post(
        `/api/${params.storeId}/clients/${params.clientId}/transaction`,
        data
      );

      window.location.assign(`/${params.storeId}/clientes/${params.clientId}`);

      console.log(response.data);

      toast.success("Transação criada com sucesso");
    } catch (err) {
      toast.error("Algo deu errado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      title="Adicionar nova transação"
      description="Adicione uma nova transação para esse cliente"
      isOpen={transactionModal.isOpen}
      onClose={transactionModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Valor"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="mt-4 mb-2">
                    <FormLabel>Tipo da transação</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-2"
                      >
                        <div>
                          <RadioGroupItem
                            value="deve"
                            id="deve"
                            disabled={loading}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="deve"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-red-200 hover:text-accent-foreground peer-data-[state=checked]:border-red-600 peer-data-[state=checked]:bg-red-300 [&:has([data-state=checked])]:border-primary"
                          >
                            DEVE
                          </Label>
                        </div>
                        <div>
                          <RadioGroupItem
                            value="pago"
                            id="pago"
                            disabled={loading}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor="pago"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-green-200 hover:text-accent-foreground peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-300 [&:has([data-state=checked])]:border-primary"
                          >
                            PAGO
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  disabled={loading}
                  variant="outline"
                  onClick={transactionModal.onClose}
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
