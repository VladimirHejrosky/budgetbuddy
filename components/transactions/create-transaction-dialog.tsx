"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TransactionSchema,
  transactionSchema,
} from "@/lib/validations/transaction";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

const TypeBadge = {
  income: "Příjem",
  expense: "Výdaj",
} as const;

const categories = [
  { id: "9aa52ba3-27af-4c30-8cac-9567dbb4ab9f", name: "Food", type: "expense" },
  {
    id: "322a5029-1864-4ad9-81de-3474d23ce18c",
    name: "Transport",
    type: "expense",
  },
  {
    id: "b3686bd5-d6c9-4430-a2d3-7b55025934b2",
    name: "Salary",
    type: "income",
  },
];

const months = [
  { value: 1, label: "Leden" },
  { value: 2, label: "Únor" },
  { value: 3, label: "Březen" },
  { value: 4, label: "Duben" },
  { value: 5, label: "Květen" },
  { value: 6, label: "Červen" },
  { value: 7, label: "Červenec" },
  { value: 8, label: "Srpen" },
  { value: 9, label: "Září" },
  { value: 10, label: "Říjen" },
  { value: 11, label: "Listopad" },
  { value: 12, label: "Prosinec" },
];

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const years = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i);

const CreateTransactionDialog = () => {
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      id: `temp-${crypto.randomUUID()}`,
      name: "",
      amount: "",
      categoryId: "",
      type: undefined,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },
  });

  const { reset, handleSubmit, register, control, watch, setValue } = form;

  const categoryId = watch("categoryId");

  useEffect(() => {
    const selected = categories.find((c) => c.id === categoryId);
    if (selected?.type === "income" || selected?.type === "expense") {
      setValue("type", selected.type);
    }
  }, [categoryId, setValue, categories]);

  const resetDefault = () => {
    reset({
      id: `temp-${crypto.randomUUID()}`,
      name: "",
      amount: "",
      categoryId: "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
  };
  const onSubmit = async (data: TransactionSchema) => {
    setOpen(false);
    console.log("Form submitted with data:", data);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) resetDefault();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          Přidat Transakci <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Přidat Transakci</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register("id")} />
            <input type="hidden" {...register("type")} />

            <FormField
              control={control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategorie</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Kategorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                          className="w-full"
                        >
                          <div className="flex w-full items-center gap-4 justify-between">
                            <span>{category.name}</span>
                            <Badge
                              className={cn(
                                category.type === "income"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              )}
                            >
                              {
                                TypeBadge[
                                  category.type as keyof typeof TypeBadge
                                ]
                              }
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Název</FormLabel>
                  <FormControl>
                    <Input placeholder="Název" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Částka</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="0"
                        onKeyDown={(e) => {
                          if (["e", "E", "+", "-"].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        type="number"
                        {...field}
                        inputMode="decimal"
                        className="pr-10 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        CZK
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-row gap-4 items-center w-full">
              <FormField
                control={control}
                name="month"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Měsíc</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Měsíc" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem
                            key={month.value}
                            value={month.value.toString()}
                            className={cn(
                              month.value === currentMonth && "font-semibold"
                            )}
                          >
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="year"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Rok</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Rok" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem
                            key={year}
                            value={year.toString()}
                            className={cn(
                              year === currentYear && "font-semibold"
                            )}
                          >
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between w-full mt-8">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
              >
                Zpět
              </Button>
              <Button type="submit">Přidat</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTransactionDialog;
