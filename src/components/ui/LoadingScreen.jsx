import { useState, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'

export function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Connecting...')

  const statuses = [
    'Connecting to markets...',
    'Loading price data...',
    'Syncing order book...',
    'Ready to trade'
  ]

  useEffect(() => {
    const duration = 2000 // Total loading time
    const interval = 50 // Update interval
    const steps = duration / interval
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const newProgress = Math.min((currentStep / steps) * 100, 100)
      setProgress(newProgress)

      // Update status message based on progress
      const statusIndex = Math.min(
        Math.floor((newProgress / 100) * statuses.length),
        statuses.length - 1
      )
      setStatus(statuses[statusIndex])

      if (currentStep >= steps) {
        clearInterval(timer)
        setTimeout(onComplete, 300)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-bg-primary z-50 flex items-center justify-center">
      <div className="w-full max-w-sm p-8 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <TrendingUp className="w-10 h-10 text-accent-green" />
          <span className="text-3xl font-semibold text-text-primary">
            PolyPerp
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-accent-green to-accent-blue rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Status text */}
        <p className="text-sm text-text-secondary">
          {status}
        </p>

        {/* Tagline */}
        <p className="text-xs text-text-muted mt-6">
          Leveraged Prediction Markets
        </p>
      </div>
    </div>
  )
}
