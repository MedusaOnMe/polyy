import { TrendingUp, Users, DollarSign, Clock, Percent, Activity } from 'lucide-react'
import { useMarket } from '../../context/MarketContext'
import { formatCompact, formatDate, formatPercent } from '../../utils/formatters'
import { FUNDING_RATE } from '../../utils/constants'

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
    {
      label: '24h Volume',
      value: formatCompact(volume24h),
      icon: <Activity className="w-4 h-4" />,
      color: 'text-accent-blue',
    },
    {
      label: 'Open Interest',
      value: formatCompact(openInterest),
      icon: <DollarSign className="w-4 h-4" />,
      color: 'text-accent-green',
    },
    {
      label: 'Total Volume',
      value: formatCompact(volume),
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-accent-purple',
    },
    {
      label: 'Liquidity',
      value: formatCompact(liquidity),
      icon: <Users className="w-4 h-4" />,
      color: 'text-accent-yellow',
    },
    {
      label: 'Funding (8h)',
      value: formatPercent(fundingRate, 4),
      icon: <Percent className="w-4 h-4" />,
      color: fundingRate >= 0 ? 'text-accent-green' : 'text-accent-red',
    },
    {
      label: 'Resolution',
      value: endDate ? formatDate(endDate) : 'TBD',
      icon: <Clock className="w-4 h-4" />,
      color: 'text-text-secondary',
    },
  ]

  return (
    <div className="bg-secondary rounded-lg border border-border p-4">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Market Stats</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center gap-1.5 text-text-secondary">
              <span className={stat.color}>{stat.icon}</span>
              <span className="text-xs">{stat.label}</span>
            </div>
            <p className={`text-sm font-semibold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Funding countdown */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">Next Funding</span>
          <FundingCountdown />
        </div>
      </div>
    </div>
  )
}

function FundingCountdown() {
  // Calculate time until next 8-hour interval
  const now = new Date()
  const hours = now.getUTCHours()
  const nextFunding = Math.ceil(hours / 8) * 8
  const hoursLeft = nextFunding - hours - 1
  const minutesLeft = 60 - now.getUTCMinutes()

  return (
    <span className="text-sm font-mono text-accent-blue">
      {String(hoursLeft).padStart(2, '0')}:{String(minutesLeft).padStart(2, '0')}:00
    </span>
  )
}
