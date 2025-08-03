"use client";

import { Transaction } from "@/lib/types";
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
import {
  DeleteTransactionSchema,
  deleteTransactionSchema,
} from "@/lib/validations/transaction";
import { deleteTransaction } from "@/lib/db/transaction";

interface Props {
  data: {
    id: string;
    name: string;
    month: number;
    year: number;
  };
  onClose: () => void;
}

const DeleteTransactionDialog = ({ data, onClose }: Props) => {
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
      await deleteTransaction(data),

    onMutate: async (deletedTransaction) => {
      await queryClient.cancelQueries({
        queryKey: ["transaction", data.month, data.year],
      });

      const previousTransactions = queryClient.getQueryData<Transaction[]>([
        "transaction",
        data.month,
        data.year,
      ]);

      queryClient.setQueryData<Transaction[]>(
        ["transaction", data.month, data.year],
        (old = []) =>
          old.filter((transaction) => transaction.id !== deletedTransaction.id)
      );

      return { previousTransactions };
    },

    onError: (err, deletedTransaction, context) => {
      queryClient.setQueryData(
        ["transaction", data.month, data.year],
        context?.previousTransactions
      );
      toast.error("Chyba při mazání transakce");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["transaction", data.month, data.year],
      });
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
            Opravdu chceš smazat transakci{" "}
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

export default DeleteTransactionDialog;
