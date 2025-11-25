// Format price as percentage (0.65 -> 65%)
export function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined) return '-'
  return `${(value * 100).toFixed(decimals)}%`
}

// Format price as cents (0.65 -> 65¢)
export function formatCents(value) {
  if (value === null || value === undefined) return '-'
  const cents = Math.round(value * 100)
  return `${cents}¢`
}

// Format price as dollars
export function formatPrice(value, decimals = 2) {
  if (value === null || value === undefined) return '-'
  return `$${Number(value).toFixed(decimals)}`
}

// Format large numbers with K, M, B suffixes
export function formatCompact(value) {
  if (value === null || value === undefined) return '-'
  const num = Number(value)
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
  if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`
  return `$${num.toFixed(2)}`
}

// Format number with commas
export function formatNumber(value, decimals = 2) {
  if (value === null || value === undefined) return '-'
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

// Format wallet address (0x1234...5678)
export function formatAddress(address) {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Format change percentage with + or -
export function formatChange(value) {
  if (value === null || value === undefined) return '-'
  const sign = value >= 0 ? '+' : ''
  return `${sign}${(value * 100).toFixed(2)}%`
}

// Format PnL with color class
export function formatPnL(value) {
  if (value === null || value === undefined) return { text: '-', class: '' }
  const isPositive = value >= 0
  return {
    text: `${isPositive ? '+' : ''}$${Math.abs(value).toFixed(2)}`,
    class: isPositive ? 'text-accent-green' : 'text-accent-red',
  }
}

// Format timestamp to relative time
export function formatTimeAgo(timestamp) {
  const now = Date.now()
  const diff = now - new Date(timestamp).getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

// Format date
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Generate random hex string (for fake addresses)
export function randomHex(length) {
  const chars = '0123456789abcdef'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * 16)]
  }
  return result
}

// Generate fake wallet address
export function generateWalletAddress() {
  return `0x${randomHex(40)}`
}

// Calculate liquidation price
export function calculateLiquidationPrice(entryPrice, leverage, side) {
  if (side === 'YES') {
    // For YES/Long: liquidates when price drops
    return Math.max(0, entryPrice - (entryPrice / leverage))
  } else {
    // For NO/Short: liquidates when price rises
    return Math.min(1, entryPrice + ((1 - entryPrice) / leverage))
  }
}

// Calculate unrealized PnL
export function calculatePnL(entryPrice, currentPrice, size, leverage, side) {
  const priceDiff = side === 'YES'
    ? currentPrice - entryPrice
    : entryPrice - currentPrice
  return priceDiff * size * leverage
}

// Calculate ROI percentage
export function calculateROI(pnl, initialSize) {
  if (initialSize === 0) return 0
  return (pnl / initialSize) * 100
}
