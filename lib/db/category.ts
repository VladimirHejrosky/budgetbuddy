"use server";

import {
  categorySchema,
  deleteCategorySchema,
  editCategorySchema,
} from "@/lib/validations/category";
import { createClient } from "../supabase/server";

export async function createCategory(unsafeData: {
  id: string;
  name: string;
  type: string;
  color: string;
}) {
  const { data, success } = categorySchema.safeParse(unsafeData);
  if (!success) throw new Error("Invalid data");

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");

  const { id, ...creatingData } = data;
  void id;
  const { error: insertError } = await supabase
    .from("category")
    .insert([{ ...creatingData, userId: user.id }]);

  if (insertError) throw new Error(insertError.message);
}

export async function getCategories() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");

  const { data: categories, error: fetchError } = await supabase
    .from("category")
    .select("*")
    .eq("userId", user.id);

  if (fetchError) throw new Error(fetchError.message);
  return categories;
}

export async function editCategory(unsafeData: {
  id: string;
  name: string;
  color: string;
}) {
  const { data, success } = editCategorySchema.safeParse(unsafeData);
  if (!success) throw new Error("Invalid data");

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");

  const { error: updateError } = await supabase
    .from("category")
    .update(data)
    .eq("id", data.id)
    .eq("userId", user.id);

  if (updateError) throw new Error(updateError.message);
}

export async function deleteCategory(unsafeData: { id: string }) {
  const { data, success } = deleteCategorySchema.safeParse(unsafeData);
  if (!success) throw new Error("Invalid data");

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");

  const { count, error: countErr } = await supabase
    .from("transaction")
    .select("*", { head: true, count: "exact" })
    .eq("categoryId", data.id)
    .eq("userId", user.id);

  if (countErr) throw new Error(countErr.message);
  if (count && count > 0) {
    const { error: updErr } = await supabase
      .from("category")
      .update({ deletedAt: new Date().toISOString() })
      .eq("id", data.id)
      .eq("userId", user.id);

    if (updErr) throw new Error(updErr.message);
  } else {
    const { error: delErr } = await supabase
      .from("category")
      .delete()
      .eq("id", data.id)
      .eq("userId", user.id);

    if (delErr) throw new Error(delErr.message);
  }
}
