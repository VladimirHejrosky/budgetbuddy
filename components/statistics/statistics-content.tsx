"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber } from "@/lib/functions/formatNumber";
import { useCategory } from "@/lib/hooks/useCategory";
import { useTransactionsByYear } from "@/lib/hooks/useTransactionsByYear";
import { PieChart, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useState } from "react";
import YearSelector from "../navigation/year-selector";
import { Skeleton } from "../ui/skeleton";

export default function StatisticsPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const { data: transactions, isLoading } = useTransactionsByYear(year);
  const { data: categories } = useCategory();

  // Yearly calculations
  const yearlyIncome = transactions
    ?.filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const yearlyExpenses = transactions
    ?.filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const yearlyBalance = yearlyIncome - yearlyExpenses;

  // Monthly breakdown
  const monthlyData = Array.from({ length: 12 }, (_, index) => {
    const monthTransactions = transactions?.filter(
      (t) => t.month === index + 1 && t.year === year
    );

    const income = monthTransactions
      ?.filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthTransactions
      ?.filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month: new Date(year, index).toLocaleDateString("cs-CZ", {
        month: "long",
      }),
      monthNumber: index + 1,
      income,
      expenses,
      balance: income - expenses,
    };
  });

  // Category breakdown for the year
  const yearlyIncomeByCategory = categories
    ?.filter((c) => c.type === "income")
    .map((category) => ({
      ...category,
      amount: transactions
        ?.filter((t) => t.categoryId === category.id && t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
    }))
    .filter((category) => category.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const yearlyExpensesByCategory = categories
    ?.filter((c) => c.type === "expense")
    .map((category) => ({
      ...category,
      amount: transactions
        ?.filter((t) => t.categoryId === category.id && t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    }))
    .filter((category) => category.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  // Find best and worst months
  const bestMonth = monthlyData.reduce((best, current) =>
    current.balance > best.balance ? current : best
  );
  const worstMonth = monthlyData.reduce((worst, current) =>
    current.balance < worst.balance ? current : worst
  );

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Roční statistiky</h1>
        </div>
        <Card className="w-full p-2 pb-0 mb-4">
          <YearSelector year={year} setYear={setYear} />
        </Card>

        {/* Yearly Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Roční příjmy
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent className="w-full flex items-center">
              <div className="text-2xl font-bold text-green-600 flex-1">
                {isLoading ? (
                  <Skeleton className="h-[32px] w-1/2 rounded-full" />
                ) : (
                  formatNumber(yearlyIncome)
                )}
              </div>
              <span className="text-sm text-muted-foreground">Kč</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Roční výdaje
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent className="w-full flex items-center">
              <div className="text-2xl font-bold text-green-600 flex-1">
                {isLoading ? (
                  <Skeleton className="h-[32px] w-1/2 rounded-full" />
                ) : (
                  formatNumber(yearlyExpenses)
                )}
              </div>
              <span className="text-sm text-muted-foreground">Kč</span>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Roční zůstatek
              </CardTitle>
              <Wallet className="h-4 w-4" />
            </CardHeader>
            <CardContent className="w-full flex items-center">
              <div
                className={`text-2xl font-bold flex-1 ${
                  yearlyBalance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {isLoading ? (
                  <Skeleton className="h-[32px] w-1/2 rounded-full" />
                ) : (
                  formatNumber(yearlyBalance)
                )}
              </div>
              <span className="text-sm text-muted-foreground">Kč</span>
            </CardContent>
          </Card>
        </div>

        {/* Best and Worst Months */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50">
            <CardHeader>
              <CardTitle className="text-green-700 dark:text-green-300">
                Nejlepší měsíc
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-lg font-semibold capitalize">
                  {bestMonth.month}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatNumber(bestMonth.balance)} Kč
                </p>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span>Příjmy: {formatNumber(bestMonth.income)} Kč</span>
                  <span>•</span>
                  <span>Výdaje: {formatNumber(bestMonth.expenses)} Kč</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50">
            <CardHeader>
              <CardTitle className="text-red-700 dark:text-red-300">
                Nejhorší měsíc
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-lg font-semibold capitalize">
                  {worstMonth.month}
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {formatNumber(worstMonth.balance)} Kč
                </p>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span>Příjmy: {formatNumber(worstMonth.income)} Kč</span>
                  <span>•</span>
                  <span>Výdaje: {formatNumber(worstMonth.expenses)} Kč</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Měsíční přehled</CardTitle>
            <CardDescription>Detailní rozpis podle měsíců</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {monthlyData.map((month, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg gap-2"
                >
                  <div className="flex items-center justify-center sm:justify-start">
                    <div className="font-medium capitalize">{month.month}</div>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-4">
                    <Badge
                      variant="secondary"
                      className="text-green-600 text-xs sm:text-sm"
                    >
                      +{formatNumber(month.income)} Kč
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-red-600 text-xs sm:text-sm"
                    >
                      -{formatNumber(month.expenses)} Kč
                    </Badge>
                    <Badge
                      variant={month.balance >= 0 ? "default" : "destructive"}
                      className={`text-xs sm:text-sm ${
                        month.balance >= 0
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : ""
                      }`}
                    >
                      {month.balance >= 0 ? "+" : ""}
                      {formatNumber(month.balance)} Kč
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Top Income Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-green-600" />
                Nejvyšší příjmy podle kategorií
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {yearlyIncomeByCategory?.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Žádné příjmy tento rok
                </p>
              ) : (
                yearlyIncomeByCategory?.slice(0, 5).map((category) => (
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
                ))
              )}
            </CardContent>
          </Card>

          {/* Top Expense Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-red-600" />
                Nejvyšší výdaje podle kategorií
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {yearlyExpensesByCategory?.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Žádné výdaje tento rok
                </p>
              ) : (
                yearlyExpensesByCategory?.slice(0, 5).map((category) => (
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
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
