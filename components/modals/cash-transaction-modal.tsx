"use client";

import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { useDataCache } from "@/contexts/DataCacheContext";

// Schema para transações de caixa
const cashTransactionSchema = z.object({
  amount: z.string().min(1, "Valor é obrigatório"),
  type: z.enum(["incoming", "outgoing", "fiado_pending"]),
  paymentMethod: z.enum([
    "cash",
    "credit_card",
    "debit_card",
    "pix",
    "va",
    "vr",
    "fiado",
    "fiado_payment",
  ]),
  description: z.string().optional(),
});

type CashTransactionFormInput = z.infer<typeof cashTransactionSchema>;

interface TransactionModalProps {
  cashRegisterId?: string;
  mode?: "client" | "cash";
}

export function TransactionModal({
  cashRegisterId,
  mode = "cash",
}: TransactionModalProps) {
  const transactionModal = useTransactionModal();
  const { addTransaction } = useDataCache();
  const params = useParams();

  const [loading, setLoading] = useState(false);

  const form = useForm<CashTransactionFormInput>({
    resolver: zodResolver(cashTransactionSchema),
    defaultValues: {
      amount: "",
      type: "incoming",
      paymentMethod: "cash",
      description: "",
    },
  });

  async function onSubmit(values: CashTransactionFormInput) {
    try {
      setLoading(true);

      if (cashRegisterId) {
        await addTransaction(cashRegisterId, {
          ...values,
          amount: parseFloat(values.amount),
        });
        toast.success("Transação adicionada com sucesso!");
        transactionModal.onClose();
        form.reset();
      }
    } catch (error) {
      toast.error("Algo deu errado!");
    } finally {
      setLoading(false);
    }
  }

  const paymentMethodLabels = {
    cash: "Dinheiro",
    credit_card: "Cartão de Crédito",
    debit_card: "Cartão de Débito",
    pix: "PIX",
    va: "Vale Alimentação",
    vr: "Vale Refeição",
    fiado: "Fiado",
    fiado_payment: "Pagamento de Fiado",
  };

  return (
    <Modal
      title="Nova Transação"
      description="Adicione uma entrada ou saída ao caixa"
      isOpen={transactionModal.isOpen}
      onClose={transactionModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Transação</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-row space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="incoming" id="incoming" />
                          <Label htmlFor="incoming">Entrada</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="outgoing" id="outgoing" />
                          <Label htmlFor="outgoing">Saída</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor</FormLabel>
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

              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Método de Pagamento</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o método" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(paymentMethodLabels).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Descrição da transação"
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
                  onClick={transactionModal.onClose}
                  type="button"
                >
                  Cancelar
                </Button>
                <Button disabled={loading} type="submit">
                  Adicionar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
}
