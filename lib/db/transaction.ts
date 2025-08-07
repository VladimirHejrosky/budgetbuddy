"use server";

import { createClient } from "../supabase/server";
import {
  deleteTransactionSchema,
  editTransactionSchema,
  EditTransactionSchema,
  TransactionSchema,
  transactionSchema,
} from "../validations/transaction";

export async function createTransaction(unsafeData: TransactionSchema) {
  const { data, success } = transactionSchema.safeParse(unsafeData);
  if (!success) throw new Error("Invalid data");

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");

  const { id, ...transactionData } = data;
  void id
  const { error: insertError } = await supabase
    .from("transaction")
    .insert([{ ...transactionData, userId: user.id }]);

  if (insertError) throw new Error(insertError.message);
}

export async function getTransactions(month: number, year: number) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");

  const { data: transactions, error: fetchError } = await supabase
    .from("transaction")
    .select("*")
    .eq("userId", user.id)
    .eq("month", month)
    .eq("year", year)
    .order("createdAt", { ascending: false });

  if (fetchError) throw new Error(fetchError.message);
  return transactions;
}

export async function getTransactionsByYear(year: number) {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) throw new Error("Unauthorized");

  const { data: transactions, error: fetchError } = await supabase
    .from("transaction")
    .select("*")
    .eq("userId", user.id)
    .eq("year", year);

  if (fetchError) throw new Error(fetchError.message);

  return transactions;
}


export async function editTransaction(unsafeData: EditTransactionSchema) {
  const { data, success, error: err } = editTransactionSchema.safeParse(unsafeData);
  if (!success) {
    console.error("Validation error", err.flatten());
    console.error("Received data", unsafeData);
    throw new Error("Invalid data");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");

  const { error: updateError } = await supabase
    .from("transaction")
    .update(data)
    .eq("id", data.id)
    .eq("userId", user.id);

  if (updateError) throw new Error(updateError.message);
}

export async function deleteTransaction(unsafeData: { id: string }) {
  const { data, success, error: err } = deleteTransactionSchema.safeParse(unsafeData);
   if (!success) {
    console.error("Validation error", err.flatten());
    console.error("Received data", unsafeData);
    throw new Error("Invalid data");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");

  const { error: deleteError } = await supabase
    .from("transaction")
    .delete()
    .eq("id", data.id)
    .eq("userId", user.id);

  if (deleteError) throw new Error(deleteError.message);
}