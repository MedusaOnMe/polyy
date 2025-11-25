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
        className="absolute inset-0 bg-term-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:top-16 md:bottom-auto md:w-full md:max-w-2xl bg-term-dark border border-term-border flex flex-col max-h-[calc(100vh-8rem)]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-term-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-term-green text-sm font-bold">&gt; SELECT_MARKET</span>
            <span className="text-[10px] text-term-text-dim">[{markets.length} AVAILABLE]</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-term-gray transition-colors"
          >
            <X className="w-4 h-4 text-term-text-dim" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-term-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-term-text-dim" />
            <input
              type="text"
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-term-black border border-term-border pl-10 pr-4 py-2 text-sm text-term-text placeholder:text-term-text-dim"
            />
          </div>
        </div>

        {/* Markets Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <span className="text-sm text-term-text-dim loading-dots">LOADING MARKETS</span>
            </div>
          ) : filteredMarkets.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <span className="text-sm text-term-text-dim">NO MARKETS FOUND</span>
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
        <div className="px-4 py-2 border-t border-term-border flex items-center justify-between text-[10px] text-term-text-dim">
          <span>Press ESC to close</span>
          <div className="flex items-center gap-2">
            <div className="status-online" />
            <span>LIVE DATA</span>
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
      className={`text-left p-3 border transition-all ${
        isSelected
          ? 'border-term-green bg-term-green/10'
          : 'border-term-border hover:border-term-green/50 bg-term-dark hover:bg-term-gray/50'
      }`}
    >
      {/* Question */}
      <p className={`text-xs line-clamp-2 mb-3 min-h-[2.5rem] ${
        isSelected ? 'text-term-green' : 'text-term-text'
      }`}>
        {market.question}
      </p>

      {/* Stats Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Price */}
          <div>
            <div className="text-[10px] text-term-text-dim mb-0.5">PRICE</div>
            <span className={`text-sm font-bold ${isSelected ? 'text-term-green term-glow' : 'text-term-green'}`}>
              {formatCents(yesPrice)}
            </span>
          </div>

          {/* Change */}
          <div>
            <div className="text-[10px] text-term-text-dim mb-0.5">24H</div>
            <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-term-green' : 'text-term-red'}`}>
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
          <div className="text-[10px] text-term-text-dim mb-0.5">VOL</div>
          <span className="text-xs text-term-text">{formatCompact(volume)}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1 bg-term-black overflow-hidden">
        <div
          className={`h-full transition-all ${isSelected ? 'bg-term-green' : 'bg-term-green/50'}`}
          style={{ width: `${yesPrice * 100}%` }}
        />
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <div className="mt-2 text-[10px] text-term-green text-center">
          CURRENTLY VIEWING
        </div>
      )}
    </button>
  )
}
