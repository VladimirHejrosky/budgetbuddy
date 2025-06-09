'use server';

import { categorySchema } from '@/lib/validations/category';
import { createClient } from '../supabase/server';

export async function createCategory(unsafeData: { name: string, type: string, color: string }) {
  const { data, success } = categorySchema.safeParse(unsafeData);
  if (!success) throw new Error("Invalid data");

  const supabase  = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");

  const { error: insertError } = await supabase
    .from('category')
    .insert([{ ...data, userId: user.id }]);

  if (insertError) throw new Error(insertError.message);
}

export async function getCategories() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");

 const { data: categories, error: fetchError } = await supabase
  .from('category')
  .select('*')
  .eq('userId', user.id);


  if (fetchError) throw new Error(fetchError.message);
  return categories;
}