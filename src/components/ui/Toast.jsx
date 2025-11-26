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
    success: <CheckCircle className="w-4 h-4 text-accent-green" />,
    error: <XCircle className="w-4 h-4 text-accent-red" />,
    warning: <AlertTriangle className="w-4 h-4 text-accent-amber" />,
    info: <Info className="w-4 h-4 text-accent-blue" />,
  }

  const backgrounds = {
    success: 'border-accent-green/30 bg-accent-green/10',
    error: 'border-accent-red/30 bg-accent-red/10',
    warning: 'border-accent-amber/30 bg-accent-amber/10',
    info: 'border-accent-blue/30 bg-accent-blue/10',
  }

  const textColors = {
    success: 'text-accent-green',
    error: 'text-accent-red',
    warning: 'text-accent-amber',
    info: 'text-accent-blue',
  }

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 border rounded-lg ${backgrounds[toast.type]} min-w-[300px] max-w-[400px] shadow-lg bg-bg-secondary`}
    >
      {icons[toast.type]}
      <p className={`text-sm flex-1 ${textColors[toast.type]}`}>
        {toast.message}
      </p>
      <button
        onClick={onClose}
        className="p-1 hover:bg-bg-elevated rounded transition-colors"
      >
        <X className="w-4 h-4 text-text-muted" />
      </button>
    </div>
  )
}
