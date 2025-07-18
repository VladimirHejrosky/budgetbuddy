"use client";

import { editTransaction } from "@/lib/db/transaction";
import { useCategory } from "@/lib/hooks/useCategory";
import { EditTransactionSchema } from "@/lib/validations/transaction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
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

interface Props {
  transactionValues: {
    id: string;
    name: string;
    amount: number;
    categoryId: string;
    type: "expense" | "income";
    month: number;
    year: number;
  };
  onClose: () => void;
}

const EditTransactionDialog = ({ transactionValues, onClose }: Props) => {
  const { data: categories } = useCategory();

  const form = useForm({
    defaultValues: {
      id: transactionValues.id,
      name: transactionValues.name,
      amount: transactionValues.amount,
      categoryId: transactionValues.categoryId,
      type: transactionValues.type,
    },
  });

  const { handleSubmit, reset, control, register, watch, setValue } = form;

  const categoryId = watch("categoryId");

  useEffect(() => {
    const selected = categories?.find((c) => c.id === categoryId);
    if (selected?.type === "income" || selected?.type === "expense") {
      setValue("type", selected.type);
    }
  }, [categoryId, setValue, categories]);

  useEffect(() => {
    if (transactionValues) {
      reset({
        id: transactionValues.id,
        name: transactionValues.name,
        amount: transactionValues.amount,
        categoryId: transactionValues.categoryId,
        type: transactionValues.type,
      });
    }
  }, [transactionValues, reset]);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: EditTransactionSchema) =>
      await editTransaction(data),
    onMutate: async (updatedTransation) => {
      await queryClient.cancelQueries({
        queryKey: [
          "transaction",
          transactionValues.month,
          transactionValues.year,
        ],
      });
      const previousCategories = queryClient.getQueryData<
        EditTransactionSchema[]
      >(["transaction", transactionValues.month, transactionValues.year]);

      queryClient.setQueryData<EditTransactionSchema[]>(
        ["transaction", transactionValues.month, transactionValues.year],
        (old = []) => {
          return old.map((transaction) =>
            transaction.id === transactionValues.id
              ? { ...transaction, ...updatedTransation }
              : transaction
          );
        }
      );
      return { previousCategories };
    },
    onError: (err, updatedCategory, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(
          ["transaction", transactionValues.month, transactionValues.year],
          context.previousCategories
        );
      }
      toast.error("Chyba při editaci transakce");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "transaction",
          transactionValues.month,
          transactionValues.year,
        ],
      });
    },
  });

  const onSubmit = async (data: EditTransactionSchema) => {
    const current = form.getValues();
    const defaults = form.formState.defaultValues;

    const hasChanged =
      current.name !== defaults?.name ||
      current.amount !== defaults?.amount ||
      current.categoryId !== defaults?.categoryId;

    if (!hasChanged) {
      onClose();
      return;
    }
    onClose();
    await mutation.mutateAsync(data);
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editovat transakci</DialogTitle>
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

            <div className="flex justify-between w-full mt-8">
              <Button variant="outline" type="button" onClick={onClose}>
                Zpět
              </Button>
              <Button type="submit">Uložit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionDialog;
