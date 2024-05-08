"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, CircleDollarSign, CreditCardIcon } from "lucide-react";
import { SaleColumn, columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import SearchProductButton from "./components/search-product-button";
import axios from "axios";
import { ChangeEvent, KeyboardEvent, useState } from "react";

const formSchema = z.object({
  code: z.string(),
  name: z.string(),
  qtd: z.number(),
  unitValue: z.number(),
  totalProduct: z.number(),
  totalSale: z.number(),
  paidValue: z.number(),
  changeValue: z.number(),
  methodType: z.enum(
    ["credito", "pix", "dinheiro", "debito", "alimentacao", "conta"],
    {
      required_error: "Selecione um método de pagamento",
    }
  ),
});

type NewSaleFormInput = z.infer<typeof formSchema>;

const sale: SaleColumn[] = [
  {
    id: "1",
    name: "chocolate",
    qtd: 2,
    unitValue: 2.5,
    productValue: 5,
    productCod: "56324",
  },
  {
    id: "1",
    name: "chocolate",
    qtd: 2,
    unitValue: 2.5,
    productValue: 5,
    productCod: "56324",
  },
  {
    id: "1",
    name: "chocolate",
    qtd: 2,
    unitValue: 2.5,
    productValue: 5,
    productCod: "56324",
  },
  {
    id: "1",
    name: "chocolate",
    qtd: 2,
    unitValue: 2.5,
    productValue: 5,
    productCod: "56324",
  },
  {
    id: "1",
    name: "chocolate",
    qtd: 2,
    unitValue: 2.5,
    productValue: 5,
    productCod: "56324",
  },
  {
    id: "1",
    name: "chocolate",
    qtd: 2,
    unitValue: 2.5,
    productValue: 5,
    productCod: "56324",
  },
  {
    id: "1",
    name: "chocolate",
    qtd: 2,
    unitValue: 2.5,
    productValue: 5,
    productCod: "56324",
  },
  {
    id: "1",
    name: "chocolate",
    qtd: 2,
    unitValue: 2.5,
    productValue: 5,
    productCod: "56324",
  },
  {
    id: "1",
    name: "chocolate",
    qtd: 2,
    unitValue: 2.5,
    productValue: 5,
    productCod: "56324",
  },
  {
    id: "1",
    name: "chocolate",
    qtd: 2,
    unitValue: 2.5,
    productValue: 5,
    productCod: "56324",
  },
];

export default function SupplierPage() {
  const [cod, setCod] = useState("");

  const form = useForm<NewSaleFormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      qtd: 1,
      methodType: "dinheiro",
      paidValue: 0,
      name: "",
    },
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCod(event?.target.value);
  };

  async function handleKeyPress(
    event: KeyboardEvent<HTMLInputElement>,
    data: string
  ) {
    if (event.key === " ") {
      const response = await axios.get(`/api/cod?code=${data}`);

      console.log(response.data);
    }
  }

  return (
    <div className="container mx-auto py-10 relative">
      <SearchProductButton />
      <div className="flex p-5 bg-blue-100 justify-between rounded-md">
        <div>
          <Form {...form}>
            <form
              className="w-[500px] flex flex-col h-full justify-between"
              onSubmit={() => {}}
            >
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="mb-5">
                      <FormLabel>DESCRIÇÃO DO PRODUTO</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} className="h-[50px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem className="mb-5 w-[430px]">
                        <FormLabel>CÓDIGO DO PRODUTO</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            {...field}
                            className="h-[50px]"
                            value={cod}
                            onChange={handleChange}
                            onKeyDown={() => handleKeyPress(event, cod)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-3 gap-[10px]">
                  <FormField
                    control={form.control}
                    name="qtd"
                    render={({ field }) => (
                      <FormItem className="mb-5">
                        <FormLabel>QUANTIDADE</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-[50px]" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="unitValue"
                    render={({ field }) => (
                      <FormItem className="mb-5">
                        <FormLabel>VALOR UNITÁRIO</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            {...field}
                            className="h-[50px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="totalProduct"
                    render={({ field }) => (
                      <FormItem className="mb-5">
                        <FormLabel>SUB-TOTAL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            {...field}
                            className="h-[50px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-[10px]">
                  <FormField
                    control={form.control}
                    name="paidValue"
                    render={({ field }) => (
                      <FormItem className="mb-5">
                        <FormLabel>VALOR PAGO</FormLabel>
                        <FormControl>
                          <Input {...field} className="h-[50px]" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="changeValue"
                    render={({ field }) => (
                      <FormItem className="mb-5">
                        <FormLabel>TROCO</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=""
                            {...field}
                            className="h-[50px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="totalSale"
                  render={({ field }) => (
                    <FormItem className="mb-5">
                      <FormLabel>TOTAL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          className="w-[270px] h-[50px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="methodType"
                  render={({ field }) => (
                    <FormItem className="mt-4 mb-2">
                      <FormLabel>FORMA DE PAGAMENTO</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-3 gap-[10px]"
                        >
                          <div>
                            <RadioGroupItem
                              value="credito"
                              id="credito"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="credito"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-green-200 hover:text-accent-foreground peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-300 [&:has([data-state=checked])]:border-primary"
                            >
                              <CreditCardIcon size={32} />
                              Crédito
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="debito"
                              id="debito"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="debito"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-green-200 hover:text-accent-foreground peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-300 [&:has([data-state=checked])]:border-primary"
                            >
                              <CreditCardIcon size={32} />
                              Débito
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="alimentacao"
                              id="alimentacao"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="alimentacao"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-green-200 hover:text-accent-foreground peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-300 [&:has([data-state=checked])]:border-primary"
                            >
                              <CreditCardIcon size={32} />
                              Alimentação
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="dinheiro"
                              id="dinheiro"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="dinheiro"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-green-200 hover:text-accent-foreground peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-300 [&:has([data-state=checked])]:border-primary"
                            >
                              <Banknote size={32} />
                              Dinheiro
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="pix"
                              id="pix"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="pix"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-green-200 hover:text-accent-foreground peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-300 [&:has([data-state=checked])]:border-primary"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 50 50"
                                width="28px"
                                height="28px"
                              >
                                <path
                                  d="M 25 0.046875 C 22.924964 0.046875 20.850972 0.83457408 19.273438 2.4121094 L 2.4121094 19.271484 C -0.7429612 22.426555 -0.7429612 27.571493 2.4121094 30.726562 L 19.273438 47.587891 C 22.42773 50.742184 27.57227 50.742184 30.726562 47.587891 L 47.587891 30.728516 C 50.742961 27.573445 50.742961 22.428507 47.587891 19.273438 L 30.728516 2.4121094 C 29.15098 0.83457408 27.075036 0.046875 25 0.046875 z M 25 2.0332031 C 26.558964 2.0332031 28.118988 2.6307072 29.314453 3.8261719 L 38.486328 13 L 37.070312 13 C 35.479355 13 33.953288 13.631896 32.828125 14.755859 A 1.0001 1.0001 0 0 0 32.828125 14.757812 L 26.060547 21.525391 C 25.466839 22.119099 24.532404 22.119686 23.9375 21.525391 L 17.169922 14.757812 C 16.046276 13.632967 14.520644 13 12.929688 13 L 11.511719 13 L 20.6875 3.8261719 C 21.882965 2.6307072 23.441036 2.0332031 25 2.0332031 z M 9.5117188 15 L 12.929688 15 C 13.99073 15 15.007506 15.420769 15.755859 16.169922 A 1.0001 1.0001 0 0 0 15.755859 16.171875 L 22.523438 22.939453 C 23.882532 24.297158 26.116318 24.297745 27.474609 22.939453 L 34.242188 16.171875 C 34.993023 15.421792 36.00927 15 37.070312 15 L 40.486328 15 L 46.173828 20.6875 C 48.564758 23.078429 48.564758 26.923524 46.173828 29.314453 L 40.488281 35 L 37.070312 35 C 36.00927 35 34.993023 34.578161 34.242188 33.828125 L 27.474609 27.060547 C 26.795464 26.381401 25.897789 26.042986 25 26.042969 C 24.102211 26.042952 23.202984 26.381695 22.523438 27.060547 L 15.755859 33.828125 A 1.0001 1.0001 0 0 0 15.755859 33.830078 C 15.007506 34.579184 13.99073 35 12.929688 35 L 9.5136719 35 L 3.8261719 29.3125 C 1.4352424 26.921571 1.4352424 23.076476 3.8261719 20.685547 L 9.5117188 15 z M 25 28.029297 C 25.382185 28.02937 25.763693 28.177755 26.060547 28.474609 L 32.828125 35.242188 A 1.0001 1.0001 0 0 0 32.828125 35.244141 C 33.953288 36.368057 35.479355 37 37.070312 37 L 38.488281 37 L 29.3125 46.173828 C 26.922793 48.563535 23.077207 48.563535 20.6875 46.173828 L 11.513672 37 L 12.929688 37 C 14.520644 37 16.046276 36.367033 17.169922 35.242188 L 23.9375 28.474609 C 24.234952 28.177462 24.617815 28.029224 25 28.029297 z"
                                  stroke="black"
                                  strokeWidth="2"
                                />
                              </svg>
                              <div className="mt-1">PIX</div>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem
                              value="conta"
                              id="conta"
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor="conta"
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-green-200 hover:text-accent-foreground peer-data-[state=checked]:border-green-600 peer-data-[state=checked]:bg-green-300 [&:has([data-state=checked])]:border-primary"
                            >
                              <CircleDollarSign size={32} />
                              Conta
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-start">
                <Button type="submit" className=" w-[270px] h-14">
                  FINALIZAR VENDA
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className="ml-5 w-full">
          <DataTable data={sale} columns={columns} />
        </div>
      </div>
    </div>
  );
}
