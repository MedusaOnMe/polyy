import { useMarket } from '../../context/MarketContext'
import { formatCompact, formatDate, formatPercent } from '../../utils/formatters'
import { Clock, TrendingUp, DollarSign, Droplets, Calendar, Percent } from 'lucide-react'

export function MarketStats() {
  const { selectedMarket } = useMarket()

  if (!selectedMarket) return null

  const volume = selectedMarket.volumeNum || selectedMarket.volume || 0
  const volume24h = selectedMarket.volume24hr || volume * 0.1
  const liquidity = selectedMarket.liquidityNum || volume * 0.2
  const endDate = selectedMarket.endDate

  // Open interest - 0 for new platform (no real positions yet)
  const openInterest = 0

  // Funding rate - 0 for new platform
  const fundingRate = 0

  const stats = [
    { label: '24h Volume', value: formatCompact(volume24h), icon: TrendingUp, color: 'text-accent-blue' },
    { label: 'Open Interest', value: formatCompact(openInterest), icon: DollarSign, color: 'text-accent-green' },
    { label: 'Total Volume', value: formatCompact(volume), icon: TrendingUp, color: 'text-text-primary' },
    { label: 'Liquidity', value: formatCompact(liquidity), icon: Droplets, color: 'text-accent-amber' },
    { label: 'Funding (8h)', value: formatPercent(fundingRate, 4), icon: Percent, color: fundingRate >= 0 ? 'text-accent-green' : 'text-accent-red' },
    { label: 'Resolution', value: endDate ? formatDate(endDate) : 'TBD', icon: Calendar, color: 'text-text-secondary' },
  ]

  return (
    <div className="bg-bg-secondary border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-text-primary">Market Stats</span>
        <FundingCountdown />
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i}>
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-xs text-text-muted">{stat.label}</span>
              </div>
              <p className={`text-sm font-mono font-medium ${stat.color}`}>{stat.value}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FundingCountdown() {
  const now = new Date()
  const hours = now.getUTCHours()
  const nextFunding = Math.ceil(hours / 8) * 8
  const hoursLeft = nextFunding - hours - 1
  const minutesLeft = 60 - now.getUTCMinutes()

  return (
    <div className="flex items-center gap-2">
      <Clock className="w-3.5 h-3.5 text-text-muted" />
      <span className="text-xs text-text-muted">Next funding:</span>
      <span className="text-sm font-mono text-accent-green">
        {String(hoursLeft).padStart(2, '0')}:{String(minutesLeft).padStart(2, '0')}:00
      </span>
    </div>
  )
}
