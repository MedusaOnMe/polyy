// API Base URLs - using proxy to avoid CORS
export const GAMMA_API = '/gamma-api'
export const CLOB_API = '/clob-api'

// Direct URLs (for reference)
export const GAMMA_API_DIRECT = 'https://gamma-api.polymarket.com'
export const CLOB_API_DIRECT = 'https://clob.polymarket.com'

// Categories for filtering
export const CATEGORIES = [
  { id: 'all', name: 'All Markets', icon: 'Flame' },
  { id: 'politics', name: 'Politics', icon: 'Vote' },
  { id: 'crypto', name: 'Crypto', icon: 'Bitcoin' },
  { id: 'sports', name: 'Sports', icon: 'Trophy' },
  { id: 'entertainment', name: 'Entertainment', icon: 'Tv' },
  { id: 'science', name: 'Science', icon: 'Microscope' },
  { id: 'business', name: 'Business', icon: 'TrendingUp' },
]

// Leverage options (max 25x)
export const LEVERAGE_OPTIONS = [1, 2, 3, 5, 10, 15, 20, 25]

// Trading fees (fake)
export const TRADING_FEE_BPS = 5 // 0.05%
export const FUNDING_RATE = 0.0001 // 0.01% per 8 hours

// Chart timeframes - fidelity values from Polymarket API docs
export const TIMEFRAMES = [
  { label: '1H', interval: '1h', fidelity: 1 },
  { label: '6H', interval: '6h', fidelity: 1 },
  { label: '1D', interval: '1d', fidelity: 5 },
  { label: '1W', interval: '1w', fidelity: 60 },
  { label: 'ALL', interval: 'max', fidelity: 60 },
]

// Default starting balance
export const DEFAULT_BALANCE = 10000

// Fake stats for trust indicators
export const FAKE_STATS = {
  totalVolume: 125000000,
  openInterest: 45000000,
  totalTraders: 12400,
  totalMarkets: 850,
}
