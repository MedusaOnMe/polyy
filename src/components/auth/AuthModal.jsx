import { useState } from 'react'
import { Mail, Eye, EyeOff, Terminal } from 'lucide-react'
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
        toast.success('Account created! Welcome to Polynomial!')
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
          <div className="w-14 h-14 mx-auto mb-4 border border-term-green flex items-center justify-center bg-term-green/10">
            <Terminal className="w-7 h-7 text-term-green" />
          </div>
          <h2 className="text-lg font-bold text-term-green term-glow mb-2">
            {mode === 'register' ? '> CREATE_ACCOUNT' : '> LOGIN'}
          </h2>
          <p className="text-term-text-dim text-xs">
            {mode === 'register'
              ? 'Trade prediction markets with up to 25x leverage'
              : 'Sign in to access your account'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-2 border border-term-red/30 bg-term-red/10 text-xs text-term-red">
              &gt; ERROR: {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] text-term-text-dim uppercase mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-term-text-dim" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
                className="w-full bg-term-black border border-term-border pl-10 pr-4 py-2 text-xs text-term-text placeholder:text-term-text-dim"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-term-text-dim uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                className="w-full bg-term-black border border-term-border px-4 py-2 pr-10 text-xs text-term-text placeholder:text-term-text-dim"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-term-text-dim hover:text-term-text"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-[10px] text-term-text-dim uppercase mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********"
                required
                className="w-full bg-term-black border border-term-border px-4 py-2 text-xs text-term-text placeholder:text-term-text-dim"
              />
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
            variant="success"
            size="lg"
            className="w-full"
          >
            &gt; {mode === 'register' ? 'CREATE_ACCOUNT' : 'LOGIN'}
          </Button>
        </form>

        <p className="text-xs text-term-text-dim text-center mt-4">
          {mode === 'register' ? (
            <>
              Already have an account?{' '}
              <button
                onClick={() => { setMode('login'); resetForm() }}
                className="text-term-green hover:underline"
              >
                Sign in
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => { setMode('register'); resetForm() }}
                className="text-term-green hover:underline"
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
