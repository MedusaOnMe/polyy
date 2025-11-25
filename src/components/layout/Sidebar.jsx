import { useState } from 'react'
import { Search } from 'lucide-react'
import { useMarket } from '../../context/MarketContext'
import { formatCents, formatChange, formatCompact } from '../../utils/formatters'

export function Sidebar() {
  const { markets, selectedMarket, selectMarket, isLoading } = useMarket()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMarkets = markets.filter(market =>
    market.question?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <aside className="w-80 bg-term-dark border-r border-term-border flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2 border-b border-term-border">
        <div className="text-[10px] text-term-text-dim uppercase tracking-wider mb-2">
          MARKETS [{markets.length}]
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-term-text-dim" />
          <input
            type="text"
            placeholder="search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-term-black border border-term-border pl-7 pr-3 py-1.5 text-xs text-term-text placeholder:text-term-text-dim"
          />
        </div>
      </div>

      {/* Market list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">
            <span className="text-xs text-term-text-dim loading-dots">LOADING</span>
          </div>
        ) : filteredMarkets.length === 0 ? (
          <div className="p-4 text-center text-xs text-term-text-dim">
            NO RESULTS
          </div>
        ) : (
          <div className="py-1">
            {filteredMarkets.map((market) => (
              <MarketItem
                key={market.id}
                market={market}
                isSelected={selectedMarket?.id === market.id}
                onSelect={() => selectMarket(market)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-term-border">
        <div className="flex items-center justify-between text-[10px] text-term-text-dim">
          <span>{filteredMarkets.length} ITEMS</span>
          <div className="flex items-center gap-1.5">
            <div className="status-online" />
            <span>CONNECTED</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

function MarketItem({ market, isSelected, onSelect }) {
  const yesPrice = market.yesPrice || 0.5
  const volume = market.volume24hr || market.volumeNum || 0

  // Calculate fake 24h change (seeded by market id for consistency)
  const seed = parseInt(market.id, 36) || 0
  const change = ((seed % 100) - 45) / 500

  return (
    <button
      onClick={onSelect}
      className={`w-full px-3 py-2 text-left transition-all border-l-2 ${
        isSelected
          ? 'bg-term-green/5 border-l-term-green'
          : 'border-l-transparent hover:bg-term-gray hover:border-l-term-text-dim'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className={`text-xs line-clamp-2 flex-1 ${isSelected ? 'text-term-green' : 'text-term-text'}`}>
          {market.question}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${isSelected ? 'text-term-green term-glow' : 'text-term-green'}`}>
            {formatCents(yesPrice)}
          </span>
          <span className={`text-[10px] ${
            change >= 0 ? 'text-term-green' : 'text-term-red'
          }`}>
            {formatChange(change)}
          </span>
        </div>
        <span className="text-[10px] text-term-text-dim">
          {formatCompact(volume)}
        </span>
      </div>

      {/* Terminal-style progress bar */}
      <div className="mt-1.5 h-1 bg-term-gray overflow-hidden">
        <div
          className="h-full bg-term-green/50 transition-all"
          style={{ width: `${yesPrice * 100}%` }}
        />
      </div>
    </button>
  )
}
