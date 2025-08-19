import CreateCategoryDialog from "@/components/category/create-category-dialog";
import CategoriesContent from "@/components/category/categories-content";
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
      <div className="flex w-full justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Kategorie</h1>
        </div>
        <CreateCategoryDialog />
      </div>
      <CategoriesContent />
    </div>
  );
};
export default CategoriesPage;
