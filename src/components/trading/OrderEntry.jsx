import { useState, useMemo } from 'react'
import { ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react'
import { useMarket } from '../../context/MarketContext'
import { useAuth } from '../../context/AuthContext'
import { usePositions } from '../../context/PositionContext'
import { useToast } from '../../context/ToastContext'
import { LeverageSlider } from './LeverageSlider'
import { formatCents, formatPrice, calculateLiquidationPrice } from '../../utils/formatters'
import { TRADING_FEE_BPS } from '../../utils/constants'

export function OrderEntry() {
  const { selectedMarket, getCurrentPrice } = useMarket()
  const { user, isAuthenticated } = useAuth()
  const { openPosition } = usePositions()
  const toast = useToast()

  const [side, setSide] = useState('YES')
  const [orderType, setOrderType] = useState('market')
  const [size, setSize] = useState('')
  const [leverage, setLeverage] = useState(5)
  const [limitPrice, setLimitPrice] = useState('')
  const [loading, setLoading] = useState(false)

  const currentPrice = getCurrentPrice()

  const calculations = useMemo(() => {
    const sizeNum = parseFloat(size) || 0
    const entryPrice = orderType === 'limit' ? parseFloat(limitPrice) || currentPrice : currentPrice
    const effectivePrice = side === 'YES' ? entryPrice : 1 - entryPrice

    const margin = sizeNum / leverage
    const shares = sizeNum / effectivePrice
    const potentialProfit = shares - sizeNum
    const fee = sizeNum * (TRADING_FEE_BPS / 10000)
    const liquidationPrice = calculateLiquidationPrice(entryPrice, leverage, side)

    return {
      margin,
      shares,
      potentialProfit,
      fee,
      liquidationPrice,
      roi: sizeNum > 0 ? (potentialProfit / sizeNum) * 100 : 0,
    }
  }, [size, leverage, side, currentPrice, orderType, limitPrice])

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast.error('Connect wallet first')
      return
    }

    if (!selectedMarket) {
      toast.error('Select a market')
      return
    }

    const sizeNum = parseFloat(size)
    if (!sizeNum || sizeNum <= 0) {
      toast.error('Enter valid size')
      return
    }

    if (calculations.margin > (user?.balance || 0)) {
      toast.error('Insufficient balance')
      return
    }

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const entryPrice = orderType === 'limit' ? parseFloat(limitPrice) || currentPrice : currentPrice
      openPosition(selectedMarket, side, sizeNum, leverage, entryPrice)
      toast.success(`${side === 'YES' ? 'Long' : 'Short'} position opened @ ${leverage}x`)
      setSize('')
    } catch (err) {
      toast.error(err.message || 'Failed to open position')
    } finally {
      setLoading(false)
    }
  }

  if (!selectedMarket) {
    return (
      <div className="bg-bg-secondary border border-border rounded-lg h-full flex items-center justify-center">
        <div className="text-sm text-text-muted">
          Select a market to trade
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg-secondary border border-border rounded-lg overflow-hidden h-full flex flex-col">
      {/* Side selector */}
      <div className="grid grid-cols-2">
        <button
          onClick={() => setSide('YES')}
          className={`py-3 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            side === 'YES'
              ? 'bg-accent-green text-white'
              : 'bg-bg-elevated text-text-secondary hover:text-text-primary border-b border-border'
          }`}
        >
          <ArrowUp className="w-4 h-4" />
          Long
        </button>
        <button
          onClick={() => setSide('NO')}
          className={`py-3 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            side === 'NO'
              ? 'bg-accent-red text-white'
              : 'bg-bg-elevated text-text-secondary hover:text-text-primary border-b border-border'
          }`}
        >
          <ArrowDown className="w-4 h-4" />
          Short
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-auto">
        {/* Order type tabs */}
        <div className="flex gap-1 p-1 bg-bg-primary rounded-lg">
          <button
            onClick={() => setOrderType('market')}
            className={`flex-1 py-2 text-sm font-medium transition-all rounded-md ${
              orderType === 'market'
                ? 'bg-bg-elevated text-text-primary'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            Market
          </button>
          <button
            onClick={() => setOrderType('limit')}
            className={`flex-1 py-2 text-sm font-medium transition-all rounded-md ${
              orderType === 'limit'
                ? 'bg-bg-elevated text-text-primary'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            Limit
          </button>
        </div>

        {/* Limit price input */}
        {orderType === 'limit' && (
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wide mb-2">
              Limit Price
            </label>
            <input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              placeholder={formatCents(currentPrice)}
              step="0.01"
              min="0.01"
              max="0.99"
              className="w-full bg-bg-primary border border-border rounded-lg px-4 py-3 text-sm font-mono text-text-primary placeholder:text-text-muted"
            />
          </div>
        )}

        {/* Size input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-text-muted uppercase tracking-wide">Size (USD)</label>
            {isAuthenticated && (
              <span className="text-xs text-text-muted">
                Balance: <span className="font-mono text-text-secondary">{formatPrice(user?.balance)}</span>
              </span>
            )}
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">$</span>
            <input
              type="number"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="0.00"
              className="w-full bg-bg-primary border border-border rounded-lg pl-8 pr-4 py-3 text-sm font-mono text-text-primary placeholder:text-text-muted"
            />
          </div>
          {/* Quick amount buttons */}
          <div className="flex gap-2 mt-2">
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                onClick={() => {
                  if (user?.balance) {
                    setSize(((user.balance * pct) / 100).toFixed(2))
                  }
                }}
                disabled={!isAuthenticated}
                className="flex-1 py-1.5 text-xs font-medium text-text-muted hover:text-text-primary bg-bg-primary hover:bg-bg-elevated rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Leverage slider */}
        <LeverageSlider value={leverage} onChange={setLeverage} />

        {/* Calculations */}
        <div className="space-y-2 pt-3 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Entry Price</span>
            <span className="font-mono text-text-primary">
              {formatCents(orderType === 'limit' && limitPrice ? parseFloat(limitPrice) : currentPrice)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Margin Required</span>
            <span className="font-mono text-text-primary">{formatPrice(calculations.margin)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Est. Shares</span>
            <span className="font-mono text-text-primary">{calculations.shares.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Max Profit</span>
            <span className="font-mono text-accent-green">
              +{formatPrice(calculations.potentialProfit)} ({calculations.roi.toFixed(1)}%)
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Trading Fee</span>
            <span className="font-mono text-text-primary">{formatPrice(calculations.fee)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-accent-amber flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Liquidation
            </span>
            <span className="font-mono text-accent-red">{formatCents(calculations.liquidationPrice)}</span>
          </div>
        </div>

        {/* Warning for high leverage */}
        {leverage >= 20 && (
          <div className="flex items-start gap-3 p-3 bg-accent-amber/10 border border-accent-amber/30 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-accent-amber flex-shrink-0 mt-0.5" />
            <p className="text-xs text-accent-amber">
              High leverage increases liquidation risk. Trade carefully.
            </p>
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !size || parseFloat(size) <= 0}
          className={`w-full py-3 text-sm font-semibold rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
            side === 'YES'
              ? 'bg-accent-green hover:bg-accent-green-hover text-white'
              : 'bg-accent-red hover:bg-accent-red-hover text-white'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Executing...
            </div>
          ) : (
            `Open ${side === 'YES' ? 'Long' : 'Short'} @ ${leverage}x`
          )}
        </button>

        {!isAuthenticated && (
          <p className="text-xs text-text-muted text-center">
            Connect your wallet to start trading
          </p>
        )}
      </div>
    </div>
  )
}
