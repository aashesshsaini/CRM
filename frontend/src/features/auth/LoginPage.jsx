import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { loginAgent } from '../../services/authService.js'
import { useAuth } from '../../app/AuthContext.jsx'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'
import { TrendingUp } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (values) => {
    try {
      const { agent } = await loginAgent(values.email, values.password)
      login(agent)
      toast.success(`Welcome back, ${agent.name}!`)

      if (agent.role === 'CALLER') {
        navigate('/caller/leads')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      toast.error(err.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Lead CRM</h1>
            <p className="text-indigo-100 text-sm">Sales Dashboard</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign in</h2>
          <p className="text-gray-500 text-sm mb-6">Enter your credentials to access the dashboard</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="admin@crm.com"
              required
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email',
                },
              })}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              {...register('password', { required: 'Password is required' })}
              error={errors.password?.message}
            />

            <Button type="submit" loading={isSubmitting} className="w-full mt-6">
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
