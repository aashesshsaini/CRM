import { Loader2 } from 'lucide-react'

export default function Loader({ message = 'Loading...', size = 'md', className = '' }) {
  const sizeMap = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-12 ${className}`}>
      <Loader2 className={`animate-spin text-indigo-500 ${sizeMap[size]}`} />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader size="lg" message="Loading data..." />
    </div>
  )
}
