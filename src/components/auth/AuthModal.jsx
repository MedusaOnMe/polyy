import { useState } from 'react'
import { Mail, Eye, EyeOff, TrendingUp } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('register') // 'login' or 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, login } = useAuth()
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match')
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters')
        }
        if (!email.includes('@')) {
          throw new Error('Please enter a valid email')
        }
        await register(email, password)
        toast.success('Account created! Welcome to PolyPerp!')
      } else {
        await login(email, password)
        toast.success('Welcome back!')
      }
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError('')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={null} size="md">
      <div>
        {/* Logo and header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-accent-green/10 flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-accent-green" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            {mode === 'register' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-text-muted text-sm">
            {mode === 'register'
              ? 'Trade prediction markets with up to 25x leverage'
              : 'Sign in to access your account'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg border border-accent-red/30 bg-accent-red/10 text-sm text-accent-red">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wide mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-bg-primary border border-border rounded-lg pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wide mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full bg-bg-primary border border-border rounded-lg px-4 py-3 pr-10 text-sm text-text-primary placeholder:text-text-muted"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs text-text-muted uppercase tracking-wide mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="w-full bg-bg-primary border border-border rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted"
              />
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
            variant="success"
            size="xl"
            className="w-full"
          >
            {mode === 'register' ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <p className="text-sm text-text-muted text-center mt-4">
          {mode === 'register' ? (
            <>
              Already have an account?{' '}
              <button
                onClick={() => { setMode('login'); resetForm() }}
                className="text-accent-green hover:underline font-medium"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => { setMode('register'); resetForm() }}
                className="text-accent-green hover:underline font-medium"
              >
                Create one
              </button>
            </>
          )}
        </p>
      </div>
    </Modal>
  )
}
