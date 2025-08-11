"use client";

import { useRecurring } from "@/lib/hooks/useRecurring";
import { DeleteRecurringTransactionSchema } from "@/lib/validations/transaction";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import DeleteRecurringDialog from "./delete-recurring-dialog";
import RecurringCard from "./recurring-card";
import { Skeleton } from "../ui/skeleton";
import { Calendar } from "lucide-react";
import { formatNumber } from "@/lib/functions/formatNumber";

const RecurringContent = () => {
  const { data: recurring, isLoading } = useRecurring();
  const [deletedItem, setDeletedItem] =
    useState<DeleteRecurringTransactionSchema | null>(null);

  const activePayments = recurring?.filter((p) => p.active);

  const totalMonthlyAmount = activePayments?.reduce((sum, payment) => {
    return (
      sum + (payment?.type === "expense" ? payment.amount : -payment.amount)
    );
  }, 0);

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Měsíční přehled
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="text-center">
              <span className="text-sm text-muted-foreground">Aktivní platby</span>
              <div className="text-2xl font-bold">{ isLoading ? (<Skeleton className="w-full h-[20px] rounded-full"/>) :activePayments?.length}</div>
            </div>
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                Celkový měsíční dopad
              </span>
              <div
                className={`text-2xl font-bold ${
                  totalMonthlyAmount >= 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                { isLoading ? <Skeleton className="w-full h-[20px] rounded-full" /> :formatNumber(Math.abs(totalMonthlyAmount))} Kč
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Měsíční platby</CardTitle>
          <CardDescription>
            Aktivní platby budou vytvořeny na začátku každého měsíce
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {recurring?.length === 0 && !isLoading && (
            <div className="flex items-center justify-center">
              <p>Žádné opakované platby.</p>
            </div>
          )}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <Skeleton className="w-full h-20" />
              <Skeleton className="w-full h-20 mt-4" />
              <Skeleton className="w-full h-20 mt-4" />
            </div>
          ) : (
            <div className="space-y-4">
              {recurring?.map((item) => (
                <RecurringCard
                  key={item.id}
                  data={item}
                  onDelete={() => setDeletedItem(item)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {deletedItem && (
        <DeleteRecurringDialog
          data={deletedItem}
          onClose={() => setDeletedItem(null)}
        />
      )}
    </>
  );
};

export default RecurringContent;
