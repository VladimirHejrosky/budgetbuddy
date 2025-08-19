"use client";

import { createRecurringTransaction } from "@/lib/db/transaction";
import { useCategory } from "@/lib/hooks/useCategory";
import {
  RecurringTransactionSchema,
  recurringTransactionSchema,
} from "@/lib/validations/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
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

const month = new Date().getMonth() + 1;
const year = new Date().getFullYear();

export const CreateRecurringDialog = () => {
  const { data: categories } = useCategory();
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(recurringTransactionSchema),
    defaultValues: {
      name: "",
      amount: "",
      categoryId: "",
      type: undefined,
      countThisMonth: true,
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

  const categoryId = watch("categoryId");

  useEffect(() => {
    const selected = categories?.find((c) => c.id === categoryId);
    if (selected?.type === "income" || selected?.type === "expense") {
      setValue("type", selected.type);
    }
  }, [categoryId, setValue, categories]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: RecurringTransactionSchema) =>
      await createRecurringTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring"] });
      queryClient.invalidateQueries({ queryKey: ["transaction", month, year] });
      queryClient.invalidateQueries({ queryKey: ["transactions", year] });
      resetDefault();
    },
    onError: () => {
      toast.error("Chyba při vytváření transakce");
    },
  });

  const resetDefault = () => {
    reset({
      name: "",
      amount: "",
      categoryId: "",
      type: undefined,
      countThisMonth: true,
    });
  };

  const onSubmit = async (data: RecurringTransactionSchema) => {
    await mutation.mutateAsync(data);
    setOpen(false);
    resetDefault();
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
          <DialogTitle>Přidat opakovanou platbu</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Opakované platby jsou vytvořeny vždy první den v měsíci
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register("type")} />

            {/* Kategorie */}
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

            {/* Název */}
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

            {/* Částka */}
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

            {/* Nový checkbox */}
            <FormField
              control={control}
              name="countThisMonth"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 w-full justify-center">
                  <FormLabel>Započítat do tohoto měsíce</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Tlačítka */}
            <div className="flex justify-between w-full mt-8">
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
              >
                Zpět
              </Button>
              <Button disabled={form.formState.isSubmitting} type="submit">
                Přidat
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
