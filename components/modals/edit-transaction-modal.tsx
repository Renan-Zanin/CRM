"use client";

import { useState, useEffect } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useEditTransactionModal } from "@/hooks/use-edit-transaction-modal";
import { useDataCache } from "@/contexts/DataCacheContext";

const formSchema = z.object({
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

type FormInput = z.infer<typeof formSchema>;

interface EditTransactionModalProps {
  cashRegisterId?: string;
}

export function EditTransactionModal({
  cashRegisterId,
}: EditTransactionModalProps) {
  const [loading, setLoading] = useState(false);
  const editTransactionModal = useEditTransactionModal();
  const { updateTransaction } = useDataCache();

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

  const form = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "incoming",
      paymentMethod: "cash",
    },
  });

  // Atualizar o formulário quando a transação for carregada
  useEffect(() => {
    if (editTransactionModal.transaction) {
      form.reset({
        amount: editTransactionModal.transaction.amount.toString(),
        type: editTransactionModal.transaction.type,
        paymentMethod: editTransactionModal.transaction.paymentMethod,
        description: editTransactionModal.transaction.description || "",
      });
    }
  }, [editTransactionModal.transaction, form]);

  async function onSubmit(data: FormInput) {
    if (!cashRegisterId || !editTransactionModal.transaction) {
      toast.error("Dados necessários não encontrados");
      return;
    }

    try {
      setLoading(true);

      await updateTransaction(
        cashRegisterId,
        editTransactionModal.transaction.id,
        {
          amount: data.amount,
          type: data.type,
          paymentMethod: data.paymentMethod,
          description: data.description,
        }
      );

      toast.success("Transação atualizada com sucesso!");
      editTransactionModal.onClose();
      form.reset();
    } catch (error) {
      toast.error("Erro ao atualizar transação");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      title="Editar Transação"
      description="Modifique os dados da transação selecionada"
      isOpen={editTransactionModal.isOpen}
      onClose={editTransactionModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Tipo de Transação</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex space-x-4"
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                  onClick={editTransactionModal.onClose}
                  type="button"
                >
                  Cancelar
                </Button>
                <Button disabled={loading} type="submit">
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
}
