"use client";

import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { formatNumber } from "@/lib/functions/formatNumber";
import { Button } from "../ui/button";
import { Edit, Trash2 } from "lucide-react";

interface Props {
  data: {
    id: string;
    name: string;
    amount: number;
    date: string;
    category: string;
    type: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

const TransactionCard = ({ data, onEdit, onDelete }: Props) => {
  return (
    <Card className="flex justify-between items-center gap-4 p-4">
      <div className="flex flex-col flex-1">
        <div className="flex-1">{data.name}</div>
        <div className="flex items-center gap-2">
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
      <div className="flex gap-1 text-muted-foreground">
        <Button
          disabled={data.id.startsWith("temp-")}
          variant="ghost"
          size="icon"
          onClick={onEdit}
        >
          <Edit />
        </Button>
        <Button
          disabled={data.id.startsWith("temp-")}
          variant="ghost"
          size="icon"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default TransactionCard;
