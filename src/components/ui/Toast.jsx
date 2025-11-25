import { useToast } from '../../context/ToastContext'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function Toast({ toast, onClose }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-accent-green" />,
    error: <XCircle className="w-5 h-5 text-accent-red" />,
    warning: <AlertTriangle className="w-5 h-5 text-accent-yellow" />,
    info: <Info className="w-5 h-5 text-accent-blue" />,
  }

  const backgrounds = {
    success: 'border-accent-green/30 bg-accent-green/10',
    error: 'border-accent-red/30 bg-accent-red/10',
    warning: 'border-accent-yellow/30 bg-accent-yellow/10',
    info: 'border-accent-blue/30 bg-accent-blue/10',
  }

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${backgrounds[toast.type]} toast-enter min-w-[300px] max-w-[400px] shadow-lg`}
    >
      {icons[toast.type]}
      <p className="text-sm text-text-primary flex-1">{toast.message}</p>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/10 rounded transition-colors"
      >
        <X className="w-4 h-4 text-text-secondary" />
      </button>
    </div>
  )
}
