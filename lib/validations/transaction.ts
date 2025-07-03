// validations/transaction.ts
import { z } from "zod";

export const transactionSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid amount"),
  categoryId: z.string().uuid(),
  type: z.enum(["income", "expense"]),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000),
});

export type TransactionSchema = z.infer<typeof transactionSchema>;