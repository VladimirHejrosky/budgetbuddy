import { Loader2 } from 'lucide-react'

const loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
    </div>
  )
}

export default loading