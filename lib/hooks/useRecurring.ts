import { useQuery } from "@tanstack/react-query";
import { getRecurringTransactions } from "../db/transaction";

export function useRecurring() {
  const data = useQuery({
    queryKey: ["recurring"],
    queryFn: async () => await getRecurringTransactions(),
    staleTime: 1000 * 60 * 15,
  });
  return data;
}
