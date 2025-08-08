"use client";

import { useRecurring } from "@/lib/hooks/useRecurring";
import { Card, CardHeader } from "../ui/card";

const RecurringContent = () => {
  const { data: recurring, isLoading } = useRecurring();
  return (
    <>
    <Card className="w-full p-4 space-y-4">
    <CardHeader>
        <h2 className="text-lg font-semibold">Opakované platby</h2>
    </CardHeader>
      {recurring?.length === 0 && !isLoading && (
          <div className="flex items-center justify-center h-full">
          <p>Žádné opakované platby.</p>
        </div>
      )}
      {isLoading ? (
          <div className="flex items-center justify-center h-full">
          <p>Načítání...</p>
        </div>
      ) : (
          <div className="space-y-4">
          {recurring?.map((item) => (
              <div key={item.id} className="p-4 border rounded-md">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p>Částka: {item.amount}</p>
            </div>
          ))}
        </div>
      )}
      </Card>
    </>
  );
};

export default RecurringContent;
