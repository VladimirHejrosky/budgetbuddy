import CreateTransactionDialog from '@/components/transactions/create-transaction-dialog';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react'

const TransactionPage = async () => {
    const supabase = await createClient();
  
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      redirect("/auth/login");
    }
  
  return (
    <div className="container mx-auto">
       <div className="flex w-full justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-semibold">Transakce</h1>
          <p className="text-muted-foreground">
            Tvé transakce
          </p>
        </div>
        <CreateTransactionDialog />
      </div>
    </div>
  )
}

export default TransactionPage