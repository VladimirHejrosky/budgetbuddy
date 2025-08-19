import { formatNumber } from "@/lib/functions/formatNumber";
import { Skeleton } from "../ui/skeleton";

interface Props {
    amount: number;
    isLoading: boolean;
}
const NumberSkeleton = ({amount, isLoading}: Props) => {
  return (
    <div className='w-full'>
              {isLoading ? (
                <Skeleton className="h-[20px] w-[40px] rounded-full" />
              ) : (
                formatNumber(amount)
              )}
            </div>
  )
}

export default NumberSkeleton