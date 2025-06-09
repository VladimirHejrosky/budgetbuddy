import CreateCategoryDialog from "@/components/forms/create-category-dialog";
import CategoriesContent from "@/components/main-content/categories-content";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const CategoriesPage = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto">
      <CreateCategoryDialog />
      <CategoriesContent />
    </div>
  );
};
export default CategoriesPage;
