import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../db/category";
import { Category } from "../types";

export function useCategory() {
  return useQuery<Category[]>({
    queryKey: ["category"],
    queryFn: async () => await getCategories(),
    staleTime: 1000 * 60 * 15,
  });
}
