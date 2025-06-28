"use client";

import { createCategory } from "@/lib/db/category";
import { CategoryFormData, categorySchema } from "@/lib/validations/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { colorOptions } from "@/lib/data/colors";
import { toast } from "sonner";

const CreateCategoryDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      id: `temp-${crypto.randomUUID()}`,
      name: "",
      type: "expense",
      color: colorOptions[0],
    },
  });

  const { reset } = form;

  const resetDefault = () => {
    reset({
      id: `temp-${crypto.randomUUID()}`,
      name: "",
      type: "expense",
      color: colorOptions[0],
    });
  }

  const mutation = useMutation({
    mutationFn: async (data: CategoryFormData) => await createCategory(data),
    onMutate: async (newCategory) => {
      await queryClient.cancelQueries({ queryKey: ["category"] });

      const previousCategories = queryClient.getQueryData<CategoryFormData[]>([
        "category",
      ]);

      queryClient.setQueryData<CategoryFormData[]>(["category"], (old = []) => [
        ...old,
        newCategory,
      ]);

      return { previousCategories };
    },
    onError: (err, newCategory, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(["category"], context.previousCategories);
      }
      toast.error("Chyba při vytváření kategorie");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      resetDefault();
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    setIsOpen(false);
    await mutation.mutateAsync(data);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open)
          resetDefault()
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Přidat kategorii
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nová kategorie</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <input type="hidden" {...form.register("id")} />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  a<FormLabel>Typ</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Vyberte typ" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">Příjem</SelectItem>
                      <SelectItem value="expense">Výdaj</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
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
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Barva</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex gap-2 flex-wrap mb-8">
                        {colorOptions.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-8 h-8 rounded-full border-2 ${
                              field.value === color
                                ? "border-foreground"
                                : "border-transparent"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => field.onChange(color)}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Label htmlFor="customColor" className="text-sm">
                          Vlastní:
                        </Label>
                        <input
                          id="customColor"
                          type="color"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="w-8 h-8 rounded-full"
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => (
                  setIsOpen(false),
                  resetDefault()
                )}
              >
                Zrušit
              </Button>
              <Button type="submit">Vytvořit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryDialog;
