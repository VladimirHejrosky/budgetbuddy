"use client";
import { useCategory } from "@/lib/hooks/useCategory";
import { Category } from "@/lib/types";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import CategoryCard from "./category-card";
import DeleteCategoryDialog from "./delete-category-dialog";
import EditCategoryDialog from "./edit-category-dialog";

const CategoriesContent = () => {
  const { data: categories, isLoading } = useCategory();
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );

  if (isLoading) {
    return <div>Načítání kategorií...</div>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Kategorie příjmů</CardTitle>
          <CardDescription>{categories?.filter(c => c.type === "income").length} kategorie</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories && categories.length > 0 ? (
            categories
              .filter((category) => category.type === "income")
              .map((category) => (
                <CategoryCard
                  key={category.id}
                  data={category}
                  onEdit={() => setEditCategory(category)}
                  onDelete={() => setDeletingCategory(category)}
                />
              ))
          ) : (
            <div>Žádné kategorie</div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Kategorie výdajů</CardTitle>
          <CardDescription>{categories?.filter(c => c.type === "expense").length} kategorií</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories && categories.length > 0 ? (
            categories
              .filter((category) => category.type === "expense")
              .map((category) => (
                <CategoryCard
                  key={category.id}
                  data={category}
                  onEdit={() => setEditCategory(category)}
                  onDelete={() => setDeletingCategory(category)}
                />
              ))
          ) : (
            <div>Žádné kategorie</div>
          )}
        </CardContent>
      </Card>
      {editCategory && (
        <EditCategoryDialog
          data={editCategory}
          onClose={() => setEditCategory(null)}
        />
      )}
      {deletingCategory && (
        <DeleteCategoryDialog
          id={deletingCategory.id}
          name={deletingCategory.name}
          onClose={() => setDeletingCategory(null)}
        />
      )}
    </div>
  );
};

export default CategoriesContent;
