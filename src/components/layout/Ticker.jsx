import { useMarket } from '../../context/MarketContext'

// Format volume as $XXk or $X.Xm
function formatVolume(vol) {
  if (!vol || vol === 0) return '$0'
  if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}m`
  if (vol >= 1000) return `$${Math.round(vol / 1000)}k`
  return `$${Math.round(vol)}`
}

export function Ticker() {
  const { markets } = useMarket()

  // Duplicate markets for seamless loop
  const tickerItems = [...markets, ...markets]

  return (
    <div className="bg-bg-secondary border-b border-border overflow-hidden">
      <div className="ticker-scroll flex items-center gap-8 py-2 px-4">
        {tickerItems.map((market, index) => {
          const price = market.yesPrice || 0.5
          const volume24h = market.volume24hr || 0

          return (
            <div
              key={`${market.id}-${index}`}
              className="flex items-center gap-3 shrink-0"
            >
              <span className="text-text-secondary text-sm truncate max-w-[200px]">
                {market.question}
              </span>
              <span className="font-mono text-sm text-text-primary">
                {(price * 100).toFixed(1)}¢
              </span>
              <span className="text-xs font-mono font-medium text-accent-blue">
                {formatVolume(volume24h)}
              </span>
              <span className="text-border">|</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
