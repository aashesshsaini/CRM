import { Link } from 'react-router-dom'
import { ShieldX } from 'lucide-react'
import Button from '../../components/common/Button.jsx'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldX className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-6">
          You do not have permission to view this page.
        </p>
        <Link to="/login">
          <Button>Back to Login</Button>
        </Link>
      </div>
    </div>
  )
}
