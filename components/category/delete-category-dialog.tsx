"use client";

import { deleteCategory } from "@/lib/db/category";
import { Category } from "@/lib/types";
import {
  DeleteCategoryFormData,
  deleteCategorySchema,
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
import { Form } from "../ui/form";
import { toast } from "sonner";

interface Props {
  id: string;
  name: string;
  onClose: () => void;
}

const DeleteCategoryDialog = ({ id, name, onClose }: Props) => {
  const form = useForm<DeleteCategoryFormData>({
    resolver: zodResolver(deleteCategorySchema),
    defaultValues: {
      id,
    },
  });

  const { reset, handleSubmit } = form;
  const queryClient = useQueryClient();

  useEffect(() => {
    reset({ id });
  }, [id, reset]);

  const mutation = useMutation({
    mutationFn: async (data: DeleteCategoryFormData) => {
      return await deleteCategory(data);
    },
    onMutate: async (deletedCategory) => {
      await queryClient.cancelQueries({ queryKey: ["category"] });
      const previousCategories = queryClient.getQueryData(["category"]);
      queryClient.setQueryData(["category"], (old: Category[] = []) =>
        old.filter((category) => category.id !== deletedCategory.id)
      );
      return { previousCategories };
    },
    onError: (err, deletedCategory, context) => {
      queryClient.setQueryData(["category"], context?.previousCategories);
      toast.error("Chyba při mazání kategorie");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
  });

  const onSubmit = async () => {
    onClose();
    await mutation.mutateAsync({ id });
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
          <DialogTitle>
            Opravdu chceš smazat kategorii{" "}
            <span className="text-destructive">&quot;{name}&quot;</span>?
          </DialogTitle>
          <DialogDescription>
            Pokud máš uložené některé transakce v této kategorii, tak pro ně
            zůstane viditelná. Nebude ji však moct použít u nových transakcí.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" {...form.register("id")} />
            <div className="flex justify-between items-center gap-4 mt-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Zpět
              </Button>
              <Button variant="destructive" type="submit">
                Smazat
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCategoryDialog;
