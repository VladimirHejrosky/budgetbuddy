"use client";

import { toggleRecurringTransaction } from "@/lib/db/transaction";
import { formatNumber } from "@/lib/functions/formatNumber";
import { useCategory } from "@/lib/hooks/useCategory";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Switch } from "../ui/switch";
interface Props {
  data: {
    id: string;
    name: string;
    amount: number;
    categoryId: string;
    type: string;
    active: boolean;
  };
  onDelete: () => void;
}

const RecurringCard = ({ data, onDelete }: Props) => {
  const { data: categories } = useCategory();

  const currentCategory = categories?.find(
    (category) => category.id === data.categoryId
  );
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { id: string; active: boolean }) => {
      await toggleRecurringTransaction(data);
    },
    onMutate: async ({ id, active }) => {
      await queryClient.cancelQueries({ queryKey: ["recurring"] });

      const previousData = queryClient.getQueryData<(typeof data)[]>([
        "recurring",
      ]);

      queryClient.setQueryData<(typeof data)[]>(["recurring"], (old = []) =>
        old.map((item) => (item.id === id ? { ...item, active } : item))
      );

      return { previousData };
    },
    onError: (_err, _data, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["recurring"], context.previousData);
      }
      toast.error("Chyba při přepínání opakované platby");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["recurring"] });
    },
  });

  const onToggle = (checked: boolean) => {
    mutation.mutate({ id: data.id, active: checked });
  };

  return (
    <Card className="flex justify-between items-center gap-4 p-4">
      <div className="flex flex-col flex-1">
        <div className="flex-1">{data.name}</div>
        <div className="flex items-center gap-2">
          <div className="text-xs flex gap-2 items-center">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: currentCategory?.color }}
            />
            <span>{currentCategory?.name}</span>
          </div>
          <span className="text-xs text-muted-foreground">•</span>
          <span
            className={cn(
              data.type === "income" ? "text-green-800" : "text-red-800",
              "font-semibold"
            )}
          >
            {formatNumber(data.amount)}
          </span>
          <span className="text-muted-foreground text-xs">CZK</span>
        </div>
      </div>
      <div className="flex gap-2 text-muted-foreground items-center">
        <Switch
          checked={data.active}
          onCheckedChange={onToggle}
          disabled={mutation.isPending}
        />
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default RecurringCard;
