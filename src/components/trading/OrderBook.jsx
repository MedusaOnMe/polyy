import { useMemo } from 'react'
import { useMarket } from '../../context/MarketContext'
import { formatCents, formatNumber, formatCompact } from '../../utils/formatters'

export function OrderBook() {
  const { orderBook, selectedMarket, isLoading, getCurrentPrice } = useMarket()

  const { bids, asks, maxSize, spread } = useMemo(() => {
    const allSizes = [...orderBook.bids, ...orderBook.asks].map(o => o.size)
    const maxSize = Math.max(...allSizes, 1)

    const topBid = orderBook.bids[0]?.price || 0
    const topAsk = orderBook.asks[0]?.price || 1
    const spread = topAsk - topBid

    return {
      bids: orderBook.bids.slice(0, 8),
      asks: orderBook.asks.slice(0, 8).reverse(),
      maxSize,
      spread,
    }
  }, [orderBook])

  const currentPrice = getCurrentPrice()

  if (!selectedMarket) {
    return (
      <div className="bg-bg-secondary border border-border rounded-lg h-full flex items-center justify-center">
        <div className="text-sm text-text-muted">
          No market selected
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg-secondary border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-text-primary">Order Book</span>
          <div className="flex items-center gap-2">
            <div className="status-online" />
            <span className="text-xs text-text-muted">Live</span>
          </div>
        </div>
      </div>

      {/* Column headers */}
      <div className="px-4 py-2 border-b border-border">
        <div className="flex justify-between text-xs text-text-muted">
          <span>Price</span>
          <span>Size</span>
          <span>Total</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-text-secondary">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Asks (NO side - red) */}
          <div className="flex-1 overflow-hidden">
            {asks.map((order, i) => (
              <OrderRow
                key={`ask-${i}`}
                price={order.price}
                size={order.size}
                maxSize={maxSize}
                side="ask"
              />
            ))}
          </div>

          {/* Spread / Current price */}
          <div className="px-4 py-3 bg-bg-primary border-y border-border">
            <div className="flex items-center justify-between">
              <span className="text-xl font-mono font-semibold text-accent-green">
                {formatCents(currentPrice)}
              </span>
              <span className="text-xs text-text-muted">
                Spread: {formatCents(spread)}
              </span>
            </div>
          </div>

          {/* Bids (YES side - green) */}
          <div className="flex-1 overflow-hidden">
            {bids.map((order, i) => (
              <OrderRow
                key={`bid-${i}`}
                price={order.price}
                size={order.size}
                maxSize={maxSize}
                side="bid"
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer stats */}
      <div className="px-4 py-3 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-text-muted">Bid Volume</span>
            <p className="font-mono text-accent-green">
              {formatCompact(bids.reduce((acc, b) => acc + b.size * b.price, 0))}
            </p>
          </div>
          <div className="text-right">
            <span className="text-text-muted">Ask Volume</span>
            <p className="font-mono text-accent-red">
              {formatCompact(asks.reduce((acc, a) => acc + a.size * (1 - a.price), 0))}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderRow({ price, size, maxSize, side }) {
  const depthPercent = (size / maxSize) * 100
  const total = price * size

  return (
    <div className="relative px-4 py-1.5 hover:bg-bg-elevated cursor-pointer transition-colors">
      {/* Depth bar */}
      <div
        className={`absolute inset-y-0 ${side === 'bid' ? 'left-0 depth-bar-green' : 'right-0 depth-bar-red'}`}
        style={{ width: `${depthPercent}%` }}
      />

      {/* Content */}
      <div className="relative flex justify-between text-xs font-mono">
        <span className={side === 'bid' ? 'text-accent-green' : 'text-accent-red'}>
          {formatCents(price)}
        </span>
        <span className="text-text-primary">{formatNumber(size, 0)}</span>
        <span className="text-text-muted">{formatNumber(total, 0)}</span>
      </div>
    </div>
  )
}
