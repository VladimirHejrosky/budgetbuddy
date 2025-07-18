import { CreateTransactionDialog } from '@/components/transactions/create-transaction-dialog';
import TransactionContent from '@/components/transactions/transaction-content';
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
      <TransactionContent />
    </div>
  )
}

export default TransactionPage