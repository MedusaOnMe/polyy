export function Skeleton({ className = '', variant = 'rect' }) {
  const variants = {
    rect: 'rounded',
    circle: 'rounded-full',
    text: 'rounded h-4',
  }

  return (
    <div className={`skeleton ${variants[variant]} ${className}`} />
  )
}

export function MarketCardSkeleton() {
  return (
    <div className="p-4 bg-secondary rounded-lg border border-border">
      <Skeleton className="h-4 w-3/4 mb-3" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>
      <Skeleton className="h-8 w-full mt-3" />
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="w-full h-[400px] bg-secondary rounded-lg border border-border flex items-center justify-center">
      <div className="text-text-secondary">Loading chart...</div>
    </div>
  )
}

export function OrderBookSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  )
}
