"use client";

import { deleteRecurringTransaction } from "@/lib/db/transaction";
import {
  DeleteTransactionSchema,
  deleteTransactionSchema,
} from "@/lib/validations/transaction";
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
import { Form } from "../ui/form";

interface Props {
  data: {
    id: string;
    name: string;
  };
  onClose: () => void;
}

const DeleteRecurringDialog = ({ data, onClose }: Props) => {
  const form = useForm<DeleteTransactionSchema>({
    resolver: zodResolver(deleteTransactionSchema),
    defaultValues: {
      id: data.id,
    },
  });

  const { reset, handleSubmit } = form;
  const queryClient = useQueryClient();

  useEffect(() => {
    reset({ id: data.id });
  }, [data.id, reset]);

  const mutation = useMutation({
    mutationFn: async (data: DeleteTransactionSchema) =>
      await deleteRecurringTransaction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring"] });
    },
    onError: () => {
      toast.error("Chyba při vytváření transakce");
    },
  });

  const onSubmit = async () => {
    onClose();
    await mutation.mutateAsync({ id: data.id });
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
            Opravdu chceš smazat trvalou platbu{" "}
            <span className="text-destructive">&quot;{data.name}&quot;</span>?
          </DialogTitle>
          <DialogDescription>Tato akce je nevratná.</DialogDescription>
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

export default DeleteRecurringDialog;
