import { useState } from 'react'
import { Search, Flame, TrendingUp, Star, ChevronRight } from 'lucide-react'
import { useMarket } from '../../context/MarketContext'
import { formatCents, formatChange, formatCompact } from '../../utils/formatters'
import { MarketCardSkeleton } from '../ui/Skeleton'

export function Sidebar() {
  const { markets, selectedMarket, selectMarket, isLoading } = useMarket()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('hot')

  const categories = [
    { id: 'hot', name: 'Hot', icon: <Flame className="w-4 h-4" /> },
    { id: 'trending', name: 'Trending', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'favorites', name: 'Favorites', icon: <Star className="w-4 h-4" /> },
  ]

  const filteredMarkets = markets.filter(market =>
    market.question?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <aside className="w-80 bg-secondary border-r border-border flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-primary border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-blue transition-colors"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 px-4 py-3 border-b border-border">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? 'bg-accent-blue/20 text-accent-blue'
                : 'text-text-secondary hover:bg-tertiary hover:text-text-primary'
            }`}
          >
            {cat.icon}
            {cat.name}
          </button>
        ))}
      </div>

      {/* Market list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <MarketCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredMarkets.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">
            No markets found
          </div>
        ) : (
          <div className="p-2">
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

      {/* Stats footer */}
      <div className="p-4 border-t border-border bg-primary">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>{markets.length} markets</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-accent-green rounded-full" />
            Live
          </span>
        </div>
      </div>
    </aside>
  )
}

function MarketItem({ market, isSelected, onSelect }) {
  // Use pre-parsed yesPrice from normalized market data
  const yesPrice = market.yesPrice || 0.5
  const volume = market.volume24hr || market.volumeNum || 0

  // Calculate fake 24h change (seeded by market id for consistency)
  const seed = parseInt(market.id, 36) || 0
  const change = ((seed % 100) - 45) / 500

  return (
    <button
      onClick={onSelect}
      className={`w-full p-3 rounded-lg text-left transition-all ${
        isSelected
          ? 'bg-accent-blue/10 border border-accent-blue/30'
          : 'hover:bg-tertiary border border-transparent'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium text-text-primary line-clamp-2 flex-1">
          {market.question}
        </p>
        <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${
          isSelected ? 'text-accent-blue rotate-90' : 'text-text-secondary'
        }`} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-accent-green">
            {formatCents(yesPrice)}
          </span>
          <span className={`text-xs font-medium ${
            change >= 0 ? 'text-accent-green' : 'text-accent-red'
          }`}>
            {formatChange(change)}
          </span>
        </div>
        <span className="text-xs text-text-secondary">
          Vol: {formatCompact(volume)}
        </span>
      </div>

      {/* Mini progress bar showing YES/NO distribution */}
      <div className="mt-2 h-1.5 bg-accent-red/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent-green rounded-full transition-all"
          style={{ width: `${yesPrice * 100}%` }}
        />
      </div>
    </button>
  )
}
