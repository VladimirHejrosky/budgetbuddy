"use client";

import { colorOptions } from "@/lib/data/colors";
import { editCategory } from "@/lib/db/category";
import {
  EditCategoryFormData,
  editCategorySchema,
} from "@/lib/validations/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { Label } from "../ui/label";
import { on } from "events";

interface Props {
  data: {
    id: string;
    name: string;
    color: string;
  } | null;
  onClose: () => void;
}

const EditCategoryDialog = ({ data, onClose }: Props) => {
  if (!data) return null;
  const { id, name, color } = data;

  const form = useForm<EditCategoryFormData>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      id: id,
      name: name,
      color: color,
    },
  });

  const { reset } = form;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data) {
      reset({
        id: id,
        name: name,
        color: color,
      });
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: async (data: EditCategoryFormData) => await editCategory(data),
    onMutate: async (updatedCategory) => {
      await queryClient.cancelQueries({ queryKey: ["category"] });
      const previousCategories = queryClient.getQueryData<
        EditCategoryFormData[]
      >(["category"]);
      queryClient.setQueryData<EditCategoryFormData[]>(
        ["category"],
        (old = []) => {
          return old.map((category) =>
            category.id === id ? { ...category, ...updatedCategory } : category
          );
        }
      );
      return { previousCategories };
    },
    onError: (err, updatedCategory, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(["category"], context.previousCategories);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });

  const onSubmit = async (data: EditCategoryFormData) => {
    const current = form.getValues();
    const defaults = form.formState.defaultValues;

    const hasChanged =
      current.name !== defaults?.name || current.color !== defaults?.color;

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upravit kategorii</DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                onClick={() => onClose?.()}
              >
                Zrušit
              </Button>
              <Button type="submit">Uložit</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDialog;
