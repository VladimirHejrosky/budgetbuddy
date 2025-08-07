"use client";

import { useTransaction } from "@/lib/hooks/useTransaction";
import { TransactionSchema } from "@/lib/validations/transaction";
import { useState } from "react";
import DateSelector from "../navigation/date-selector";
import { Card } from "../ui/card";
import { CreateTransactionDialog } from "./create-transaction-dialog";
import DeleteTransactionDialog from "./delete-transaction-dialog";
import EditTransactionDialog from "./edit-transaction-dialog";
import TransactionCard from "./transaction-card";

const TransactionContent = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const { data: transactions, isLoading } = useTransaction(month, year);
  const [editTransaction, setEditTransaction] =
    useState<TransactionSchema | null>(null);
  const [deleteTransaction, setDeleteTransaction] =
    useState<TransactionSchema | null>(null);

  return (
    <>
      <div className="flex w-full justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-semibold">Transakce</h1>
        </div>
        <CreateTransactionDialog monthOfCard={month} yearOfCard={year} />
      </div>
      <Card className="w-full flex flex-col gap-4 p-4">
        <DateSelector
          month={month}
          year={year}
          setMonth={setMonth}
          setYear={setYear}
        />

        {isLoading && <div>Načítání...</div>}
        {transactions?.length === 0 && (
          <div className="text-center">Žádné transakce tento měsíc</div>
        )}
        {transactions?.map((transaction) => (
          <TransactionCard
            key={transaction.id}
            data={transaction}
            onEdit={() => setEditTransaction(transaction)}
            onDelete={() => setDeleteTransaction(transaction)}
          />
        ))}
      </Card>
      {editTransaction && (
        <EditTransactionDialog
          transactionValues={editTransaction}
          onClose={() => setEditTransaction(null)}
        />
      )}
      {deleteTransaction && (
        <DeleteTransactionDialog
          data={deleteTransaction}
          onClose={() => setDeleteTransaction(null)}
        />
      )}
    </>
  );
};

export default TransactionContent;
