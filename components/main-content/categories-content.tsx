"use client";
import { useCategory } from "@/lib/hooks/useCategory";
import { v4 as uuidv4 } from 'uuid';
const CategoriesContent = () => {
  const { data: categories, isLoading } = useCategory();

  if (isLoading) {
    return <div>Načítání kategorií...</div>;
  }

  return (
    <>
      {categories && categories.length > 0 ? (
        <ul>
          {categories.map((category) => (
            <li
              key={category.id || uuidv4()}
              className="flex items-center gap-2 p-4 border-b"
            >
              {category.name}
            </li>
          ))}
        </ul>
      ) : (
        <div>Žádné kategorie</div>
      )}
    </>
  );
};

export default CategoriesContent;
