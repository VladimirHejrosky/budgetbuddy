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
import { Label } from "../ui/label";

interface Props {
  data: {
    id: string;
    name: string;
    color: string;
  } | null;
  onClose: () => void;
}

const EditCategoryDialog = ({ data, onClose }: Props) => {
  const queryClient = useQueryClient();

  const form = useForm<EditCategoryFormData>({
    resolver: zodResolver(editCategorySchema),
    defaultValues: {
      id: "",
      name: "",
      color: "#000000",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (data) {
      reset({
        id: data.id,
        name: data.name,
        color: data.color,
      });
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: async (data: EditCategoryFormData) => await editCategory(data),
    onMutate: async (updatedCategory) => {
      await queryClient.cancelQueries({ queryKey: ["category"] });

      const previousCategories = queryClient.getQueryData<EditCategoryFormData[]>(["category"]);

      queryClient.setQueryData<EditCategoryFormData[]>(["category"], (old = []) =>
        old.map((cat) =>
          cat.id === updatedCategory.id ? { ...cat, ...updatedCategory } : cat
        )
      );

      return { previousCategories };
    },
    onError: (_, __, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(["category"], context.previousCategories);
      }
      toast.error("Chyba při editaci kategorie");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });

  const onSubmit = async (values: EditCategoryFormData) => {
    const { name, color } = values;
    const { name: defaultName, color: defaultColor } = form.formState.defaultValues || {};

    const hasChanged = name !== defaultName || color !== defaultColor;

    if (!hasChanged) {
      onClose();
      return;
    }

    await mutation.mutateAsync(values);
    onClose();
  };

  if (!data) return null;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
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
                        {colorOptions.map((clr) => (
                          <button
                            key={clr}
                            type="button"
                            className={`w-8 h-8 rounded-full border-2 ${
                              field.value === clr
                                ? "border-foreground"
                                : "border-transparent"
                            }`}
                            style={{ backgroundColor: clr }}
                            onClick={() => field.onChange(clr)}
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

            <div className="flex justify-between gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Zrušit
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                Uložit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryDialog;
