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
    success: <CheckCircle className="w-4 h-4 text-term-green" />,
    error: <XCircle className="w-4 h-4 text-term-red" />,
    warning: <AlertTriangle className="w-4 h-4 text-term-amber" />,
    info: <Info className="w-4 h-4 text-term-cyan" />,
  }

  const backgrounds = {
    success: 'border-term-green/30 bg-term-green/10',
    error: 'border-term-red/30 bg-term-red/10',
    warning: 'border-term-amber/30 bg-term-amber/10',
    info: 'border-term-cyan/30 bg-term-cyan/10',
  }

  const textColors = {
    success: 'text-term-green',
    error: 'text-term-red',
    warning: 'text-term-amber',
    info: 'text-term-cyan',
  }

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 border ${backgrounds[toast.type]} min-w-[280px] max-w-[380px] shadow-lg bg-term-dark`}
    >
      {icons[toast.type]}
      <p className={`text-xs flex-1 ${textColors[toast.type]}`}>
        &gt; {toast.message}
      </p>
      <button
        onClick={onClose}
        className="p-1 hover:bg-term-gray transition-colors"
      >
        <X className="w-3 h-3 text-term-text-dim" />
      </button>
    </div>
  )
}
