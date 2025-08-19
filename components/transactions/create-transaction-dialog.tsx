"use client";

import { months } from "@/lib/data/months";
import { createTransaction } from "@/lib/db/transaction";
import { useCategory } from "@/lib/hooks/useCategory";
import { cn } from "@/lib/utils";
import {
  TransactionSchema,
  transactionSchema,
} from "@/lib/validations/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();
const years = Array.from(
  { length: currentYear - 2025 + 1 },
  (_, i) => 2025 + i
);

interface Props {
  monthOfCard: number;
  yearOfCard: number;
}

export const CreateTransactionDialog = ({ monthOfCard, yearOfCard }: Props) => {
  const { data: categories } = useCategory();
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      id: `temp-${crypto.randomUUID()}`,
      name: "",
      amount: "",
      categoryId: "",
      type: undefined,
      month: monthOfCard,
      year: yearOfCard,
    },
  });

  const { reset, handleSubmit, register, control, watch, setValue } = form;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    form.reset((prev) => ({
      ...prev,
      month: monthOfCard,
      year: yearOfCard,
    }));
  }, [monthOfCard, yearOfCard, form]);

  const categoryId = watch("categoryId");

  useEffect(() => {
    const selected = categories?.find((c) => c.id === categoryId);
    if (selected?.type === "income" || selected?.type === "expense") {
      setValue("type", selected.type);
    }
  }, [categoryId, setValue, categories]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: TransactionSchema) =>
      await createTransaction(data),

    onMutate: async (newTransaction) => {
      const queryKey = [
        "transaction",
        newTransaction.month,
        newTransaction.year,
      ] as const;

      await queryClient.cancelQueries({ queryKey });

      const previousTransactions =
        queryClient.getQueryData<TransactionSchema[]>(queryKey);

      queryClient.setQueryData<TransactionSchema[]>(queryKey, (old = []) => [
        ...old,
        newTransaction,
      ]);

      return { previousTransactions, queryKey };
    },

    onError: (err, newTransaction, context) => {
      if (context?.previousTransactions) {
        queryClient.setQueryData(
          context.queryKey,
          context.previousTransactions
        );
      }
      toast.error("Chyba při vytváření transakce");
    },

    onSettled: (_, __, ___, context) => {
      if (context?.queryKey) {
        queryClient.invalidateQueries({ queryKey: context.queryKey });
      }
      resetDefault();
    },
  });

  const resetDefault = () => {
    reset({
      id: `temp-${crypto.randomUUID()}`,
      name: "",
      amount: "",
      categoryId: "",
      month: monthOfCard,
      year: yearOfCard,
    });
  };
  const onSubmit = async (data: TransactionSchema) => {
    setOpen(false);
    await mutation.mutateAsync(data);
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
        <Button
          className={`fixed right-4 sm:relative sm:right-0 z-0 transition-opacity duration-300  ${
            scrolled ? "opacity-80" : "opacity-100"
          }`}
        >
          {" "}
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto will-change-auto">
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
                      {categories?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                          className="w-full"
                        >
                          <div className="flex w-full items-center gap-4 justify-between">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span>{category.name}</span>
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
                      onValueChange={(value) => field.onChange(Number(value))}
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
