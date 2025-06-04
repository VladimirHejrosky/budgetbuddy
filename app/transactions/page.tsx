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
    <div className="container mx-auto">TransactionPage</div>
  )
}

export default TransactionPage