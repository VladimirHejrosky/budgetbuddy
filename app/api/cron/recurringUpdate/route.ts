import { createClient } from "@/lib/supabase/service";
import { NextRequest, NextResponse } from "next/server";

type NewTransaction = {
  userId: string;
  name: string;
  amount: number;
  categoryId: string;
  type: "income" | "expense";
  month: number;
  year: number;
};

export async function GET(req: NextRequest) {
    console.log("Recurring update endpoint hit");
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const supabase = await createClient();

  const { data: recurringTransactions, error } = await supabase
    .from("recurringTransaction")
    .select("*")
    .eq("active", true);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!recurringTransactions || recurringTransactions.length === 0) {
    return NextResponse.json({ message: "No active recurring transactions" });
  }

  const newTransactions: NewTransaction[] = recurringTransactions.map(
    (rt: NewTransaction) => ({
      userId: rt.userId,
      name: rt.name,
      amount: rt.amount,
      categoryId: rt.categoryId,
      type: rt.type,
      month: currentMonth,
      year: currentYear,
    })
  );

  const { error: insertError } = await supabase
    .from("transaction")
    .insert(newTransactions);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Recurring transactions processed",
    count: newTransactions.length,
  });
}
