// validations/transaction.ts
import { z } from "zod";

export const transactionSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, "Název je povinný")
    .max(50, "Název nesmí být delší než 50 znaků"),
  amount: z.coerce
    .number()
    .int("Zadejte celé číslo")
    .positive("Částka musí být kladné celé číslo"),
  categoryId: z.string(),
  type: z.enum(["income", "expense"]),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000),
});

export type TransactionSchema = z.infer<typeof transactionSchema>;

export const editTransactionSchema = transactionSchema.pick({
  id: true,
  name: true,
  amount: true,
  categoryId: true,
  type: true,
});
export type EditTransactionSchema = z.infer<typeof editTransactionSchema>;

export const deleteTransactionSchema = transactionSchema.pick({
  id: true,
});

export type DeleteTransactionSchema = z.infer<typeof deleteTransactionSchema>;