"use server"

import { createClient } from "../supabase/server";
import { TransactionSchema, transactionSchema } from "../validations/transaction";

const createTransaction = async (unsafeData: TransactionSchema) => {
  const { data, success } = transactionSchema.safeParse(unsafeData);
  if (!success) throw new Error("Invalid data");

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");

  const {id, ...transactionData} = data;

  const { error: insertError } = await supabase
    .from("transaction")
    .insert([{ ...transactionData, userId: user.id }]);

  if (insertError) throw new Error(insertError.message);
}