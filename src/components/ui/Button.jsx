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
  const baseClasses = 'font-medium transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-term-green/10 hover:bg-term-green text-term-green hover:text-term-black border border-term-green',
    success: 'bg-term-green/10 hover:bg-term-green text-term-green hover:text-term-black border border-term-green',
    danger: 'bg-term-red/10 hover:bg-term-red text-term-red hover:text-term-black border border-term-red',
    warning: 'bg-term-amber/10 hover:bg-term-amber text-term-amber hover:text-term-black border border-term-amber',
    ghost: 'bg-transparent hover:bg-term-gray text-term-text border border-term-border hover:border-term-green/50',
    outline: 'bg-transparent border border-term-green text-term-green hover:bg-term-green/10',
  }

  const sizes = {
    sm: 'px-2 py-1 text-[10px]',
    md: 'px-3 py-1.5 text-xs',
    lg: 'px-4 py-2 text-xs',
    xl: 'px-6 py-3 text-sm',
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <span className="loading-dots">_</span>
      )}
      {children}
    </button>
  )
}
