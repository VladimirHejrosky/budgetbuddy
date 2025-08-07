import { useQuery } from "@tanstack/react-query";
import { getTransactionsByYear } from "../db/transaction";

export function useTransactionsByYear(year: number) {
  const data = useQuery({
    queryKey: ["transactions", year],
    queryFn: async () => await getTransactionsByYear(year),
    staleTime: 1000 * 60 * 5,
  });

  return data;
}
