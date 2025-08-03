"use client";

import { useTransaction } from "@/lib/hooks/useTransaction";
import { useState } from "react";
import { CreateTransactionDialog } from "../transactions/create-transaction-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import DateSelector from "../navigation/date-selector";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { formatNumber } from "@/lib/functions/formatNumber";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";
import { useCategory } from "@/lib/hooks/useCategory";
import { cn } from "@/lib/utils";

const DashboardContent = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const { data: transactions, isLoading } = useTransaction(month, year);
  const { data: categories } = useCategory();

  const totalIncome = transactions
    ?.filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    ?.filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  const incomeByCategory = categories
    ?.filter((c) => c.type === "income")
    .map((category) => {
      const amount = transactions
        ?.filter((t) => t.categoryId === category.id && t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...category, amount };
    })
    .filter((c) => c.amount > 0);

  const expensesByCategory = categories
    ?.filter((c) => c.type === "expense")
    .map((category) => {
      const amount = transactions
        ?.filter((t) => t.categoryId === category.id && t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...category, amount };
    })
    .filter((c) => c.amount > 0);

    const latestTransactions = [...(transactions ?? [])]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 5);


  return (
    <>
      <div className="flex w-full justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Přehled</h1>
        </div>
        <CreateTransactionDialog monthOfCard={month} yearOfCard={year} />
      </div>
      <Card className="w-full p-2 pb-0 mb-4">
        <DateSelector
          month={month}
          year={year}
          setMonth={setMonth}
          setYear={setYear}
        />
      </Card>

      <div className="grid gap-4 md:grid-cols-3 mb-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Měsíční příjmy
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent className="w-full flex items-center">
            <div className="text-2xl font-bold text-green-600 flex-1">
              {isLoading ? (
                <Skeleton className="h-[32px] w-1/2 rounded-full" />
              ) : (
                formatNumber(totalIncome)
              )}
            </div>
            <span className="text-sm text-muted-foreground">Kč</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Měsíční výdaje
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent className="w-full flex items-center">
            <div className="text-2xl font-bold text-red-600 flex-1">
              {isLoading ? (
                <Skeleton className="h-[32px] w-1/2 rounded-full" />
              ) : (
                formatNumber(totalExpenses)
              )}
            </div>
            <span className="text-sm text-muted-foreground">Kč</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Měsíční zůstatek
            </CardTitle>
            <Wallet className="h-4 w-4" />
          </CardHeader>
          <CardContent className="w-full flex items-center">
            <div
              className={`text-2xl font-bold flex-1 ${
                balance >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {isLoading ? (
                <Skeleton className="h-[32px] w-1/2 rounded-full" />
              ) : (
                formatNumber(balance)
              )}
            </div>
            <span className="text-sm text-muted-foreground">Kč</span>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Příjmy podle kategorií</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {incomeByCategory?.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm">{category.name}</span>
                </div>
                <Badge variant="secondary" className="text-green-600">
                  {formatNumber(category.amount)} Kč
                </Badge>
              </div>
            ))}
            {incomeByCategory?.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Žádné kategorie příjmů
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Výdaje podle kategorií</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {expensesByCategory?.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm">{category.name}</span>
                </div>
                <Badge variant="secondary" className="text-red-600">
                  {formatNumber(category.amount)} Kč
                </Badge>
              </div>
            ))}
            {expensesByCategory?.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                Žádné kategorie výdajů
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="flex flex-col w-full gap-4 p-4">
        <CardTitle>Poslední transakce tento měsíc</CardTitle>
        {latestTransactions?.length === 0 ? (
          <div className="text-center text-muted-foreground py-4">
            Žádné transakce pro tento měsíc
          </div>
        ) : isLoading ? (
          <Skeleton className="w-full h-[30px] rounded-full" />
        ) : (
          latestTransactions?.slice(0, 5).map((transaction) => (
            <Card
              key={transaction.id}
              className="flex justify-between items-center gap-4 p-4"
            >
              <div className="flex-1">{transaction.name}</div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    transaction.type === "income"
                      ? "text-green-800"
                      : "text-red-800",
                    "font-semibold"
                  )}
                >
                  {formatNumber(transaction.amount)}
                </span>
                <span className="text-muted-foreground text-xs">CZK</span>
              </div>
            </Card>
          ))
        )}
      </Card>
    </>
  );
};

export default DashboardContent;
