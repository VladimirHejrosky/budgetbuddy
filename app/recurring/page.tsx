import { CreateRecurringDialog } from '@/components/recurring/create-recurring-dialog';
import RecurringContent from '@/components/recurring/recurring-content';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

const RecurringPage = async () => {
      const supabase = await createClient();
    
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        redirect("/auth/login");
      }
    
  return (
        <div className="container mx-auto">
      <div className="flex w-full justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-semibold">Opakované platby</h1>
        </div>
        <CreateRecurringDialog />
      </div>
      <RecurringContent />
    </div>
  )
}

export default RecurringPage