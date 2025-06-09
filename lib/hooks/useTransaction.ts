import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "../db/transaction";

export function useTransaction(month: number, year: number) {
  const data = useQuery({
    queryKey: ["transaction", month, year],
    queryFn: async () => await getTransactions(month, year),
    staleTime: 1000 * 60 * 5,
  });
  return data;
}
