import { useState } from 'react'
import { Search, X, TrendingUp, TrendingDown } from 'lucide-react'
import { useMarket } from '../../context/MarketContext'
import { formatCents, formatChange, formatCompact } from '../../utils/formatters'

export function MarketsModal({ isOpen, onClose }) {
  const { markets, selectedMarket, selectMarket, isLoading } = useMarket()
  const [searchQuery, setSearchQuery] = useState('')

  if (!isOpen) return null

  const filteredMarkets = markets.filter(market =>
    market.question?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelect = (market) => {
    selectMarket(market)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:top-16 md:bottom-auto md:w-full md:max-w-2xl bg-bg-secondary border border-border rounded-lg flex flex-col max-h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-base font-semibold text-text-primary">Select Market</span>
            <span className="text-xs text-text-muted px-2 py-0.5 bg-bg-elevated rounded">
              {markets.length} available
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-bg-elevated rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-bg-primary border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted"
            />
          </div>
        </div>

        {/* Markets Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-text-secondary">Loading markets...</span>
              </div>
            </div>
          ) : filteredMarkets.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <span className="text-sm text-text-muted">No markets found</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredMarkets.map((market) => (
                <MarketCard
                  key={market.id}
                  market={market}
                  isSelected={selectedMarket?.id === market.id}
                  onSelect={() => handleSelect(market)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between text-xs text-text-muted">
          <span>Press ESC to close</span>
          <div className="flex items-center gap-2">
            <div className="status-online" />
            <span>Live data</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function MarketCard({ market, isSelected, onSelect }) {
  const yesPrice = market.yesPrice || 0.5
  const volume = market.volume24hr || market.volumeNum || 0

  // Calculate fake 24h change (seeded by market id for consistency)
  const seed = parseInt(market.id, 36) || 0
  const change = ((seed % 100) - 45) / 500
  const isPositive = change >= 0

  return (
    <button
      onClick={onSelect}
      className={`text-left p-4 border rounded-lg transition-all ${
        isSelected
          ? 'border-accent-green bg-accent-green/5'
          : 'border-border hover:border-border-light bg-bg-elevated/50 hover:bg-bg-elevated'
      }`}
    >
      {/* Question */}
      <p className={`text-sm line-clamp-2 mb-3 min-h-[2.5rem] ${
        isSelected ? 'text-accent-green' : 'text-text-primary'
      }`}>
        {market.question}
      </p>

      {/* Stats Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Price */}
          <div>
            <div className="text-xs text-text-muted mb-0.5">Price</div>
            <span className={`text-sm font-mono font-semibold ${isSelected ? 'text-accent-green' : 'text-accent-green'}`}>
              {formatCents(yesPrice)}
            </span>
          </div>

          {/* Change */}
          <div>
            <div className="text-xs text-text-muted mb-0.5">24h</div>
            <div className={`flex items-center gap-1 text-xs font-mono ${isPositive ? 'text-accent-green' : 'text-accent-red'}`}>
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {formatChange(change)}
            </div>
          </div>
        </div>

        {/* Volume */}
        <div className="text-right">
          <div className="text-xs text-text-muted mb-0.5">Volume</div>
          <span className="text-xs font-mono text-text-secondary">{formatCompact(volume)}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1.5 bg-bg-primary rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isSelected ? 'bg-accent-green' : 'bg-accent-green/60'}`}
          style={{ width: `${yesPrice * 100}%` }}
        />
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="mt-2 text-xs text-accent-green text-center font-medium">
          Currently viewing
        </div>
      )}
    </button>
  )
}
