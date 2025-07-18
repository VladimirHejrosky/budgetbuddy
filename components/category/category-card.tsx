"use client";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface Props {
  data: {
    id: string;
    name: string;
    color: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}
const CategoryCard = ({ data, onEdit, onDelete }: Props) => {
  return (
    <>
      <Card className="flex justify-between flex-row items-center gap-3 p-2">
        <div className="flex justify-start items-center gap-2">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span className="font-medium">{data.name}</span>
        </div>
        <div className="flex gap-1">
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
    </>
  );
};

export default CategoryCard;
