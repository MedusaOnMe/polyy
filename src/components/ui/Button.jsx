export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  ...props
}) {
  const baseClasses = 'font-medium transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed rounded-md'

  const variants = {
    primary: 'bg-accent-green hover:bg-accent-green-hover text-white',
    success: 'bg-accent-green hover:bg-accent-green-hover text-white',
    danger: 'bg-accent-red hover:bg-accent-red-hover text-white',
    warning: 'bg-accent-amber hover:bg-accent-amber/90 text-white',
    ghost: 'bg-transparent hover:bg-bg-elevated text-text-secondary border border-border hover:border-border-light hover:text-text-primary',
    outline: 'bg-transparent border border-accent-green text-accent-green hover:bg-accent-green/10',
  }

  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-sm',
    xl: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
