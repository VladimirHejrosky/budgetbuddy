import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const CategoriesPage = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return <div className="container mx-auto">CategoriesPage</div>;
};

export default CategoriesPage;
