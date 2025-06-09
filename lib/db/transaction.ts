"use server";

import { db } from "@/drizzle/db";
import { transaction } from "@/drizzle/schema";
import { transactionSchema } from "@/lib/validations/transaction";
import { createClient } from "../supabase/server";
import { eq, desc } from "drizzle-orm";

export async function createTransaction(formData: FormData) {
  const parsed = transactionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) throw new Error("Invalid data");

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) throw new Error("Unauthorized");

  const data = parsed.data;

  await db.insert(transaction).values({
    ...data,
    amount: Number(data.amount),
    userId: user.id,
  });
}

export async function getTransactions(month: number, year: number) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) throw new Error("Unauthorized");

  const rows = await db
    .select()
    .from(transaction)
    .where(
      eq(transaction.userId, user.id) &&
      eq(transaction.month, month) &&
      eq(transaction.year, year)
    )
    .orderBy(desc(transaction.createdAt));

  return rows;
}
