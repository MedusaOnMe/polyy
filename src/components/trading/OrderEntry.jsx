import { useState, useMemo } from 'react'
import { ArrowUpRight, ArrowDownRight, AlertTriangle, Zap } from 'lucide-react'
import { useMarket } from '../../context/MarketContext'
import { useAuth } from '../../context/AuthContext'
import { usePositions } from '../../context/PositionContext'
import { useToast } from '../../context/ToastContext'
import { Button } from '../ui/Button'
import { LeverageSlider } from './LeverageSlider'
import { formatCents, formatPrice, calculateLiquidationPrice } from '../../utils/formatters'
import { TRADING_FEE_BPS } from '../../utils/constants'

export function OrderEntry() {
  const { selectedMarket, getCurrentPrice } = useMarket()
  const { user, isAuthenticated } = useAuth()
  const { openPosition } = usePositions()
  const toast = useToast()

  const [side, setSide] = useState('YES') // 'YES' or 'NO'
  const [orderType, setOrderType] = useState('market') // 'market' or 'limit'
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
    const potentialProfit = shares - sizeNum // If outcome is correct (price goes to $1)
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
      toast.error('Please connect your wallet first')
      return
    }

    if (!selectedMarket) {
      toast.error('Please select a market')
      return
    }

    const sizeNum = parseFloat(size)
    if (!sizeNum || sizeNum <= 0) {
      toast.error('Please enter a valid size')
      return
    }

    if (calculations.margin > (user?.balance || 0)) {
      toast.error('Insufficient balance')
      return
    }

    setLoading(true)
    try {
      // Simulate order execution delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const entryPrice = orderType === 'limit' ? parseFloat(limitPrice) || currentPrice : currentPrice
      openPosition(selectedMarket, side, sizeNum, leverage, entryPrice)

      toast.success(`Opened ${side} position with ${leverage}x leverage!`)
      setSize('')
    } catch (err) {
      toast.error(err.message || 'Failed to open position')
    } finally {
      setLoading(false)
    }
  }

  if (!selectedMarket) {
    return (
      <div className="bg-secondary rounded-lg border border-border p-6">
        <div className="text-center text-text-secondary">
          Select a market to trade
        </div>
      </div>
    )
  }

  return (
    <div className="bg-secondary rounded-lg border border-border overflow-hidden h-full flex flex-col">
      {/* Side selector */}
      <div className="grid grid-cols-2">
        <button
          onClick={() => setSide('YES')}
          className={`py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
            side === 'YES'
              ? 'bg-accent-green text-white'
              : 'bg-tertiary text-text-secondary hover:text-text-primary'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          YES / LONG
        </button>
        <button
          onClick={() => setSide('NO')}
          className={`py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
            side === 'NO'
              ? 'bg-accent-red text-white'
              : 'bg-tertiary text-text-secondary hover:text-text-primary'
          }`}
        >
          <ArrowDownRight className="w-4 h-4" />
          NO / SHORT
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-auto">
        {/* Order type */}
        <div className="flex gap-2">
          <button
            onClick={() => setOrderType('market')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
              orderType === 'market'
                ? 'bg-tertiary text-text-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Market
          </button>
          <button
            onClick={() => setOrderType('limit')}
            className={`flex-1 py-2 text-xs font-medium rounded-lg transition-colors ${
              orderType === 'limit'
                ? 'bg-tertiary text-text-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Limit
          </button>
        </div>

        {/* Limit price input */}
        {orderType === 'limit' && (
          <div>
            <label className="block text-xs text-text-secondary mb-1.5">
              Limit Price
            </label>
            <div className="relative">
              <input
                type="number"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                placeholder={formatCents(currentPrice)}
                step="0.01"
                min="0.01"
                max="0.99"
                className="w-full bg-primary border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-blue transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-secondary">
                ¢
              </span>
            </div>
          </div>
        )}

        {/* Size input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-text-secondary">Size (USD)</label>
            {isAuthenticated && (
              <span className="text-xs text-text-secondary">
                Balance: <span className="text-text-primary">{formatPrice(user?.balance)}</span>
              </span>
            )}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">$</span>
            <input
              type="number"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="0.00"
              className="w-full bg-primary border border-border rounded-lg pl-7 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent-blue transition-colors"
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
                className="flex-1 py-1.5 text-xs font-medium rounded bg-tertiary text-text-secondary hover:text-text-primary hover:bg-border transition-colors disabled:opacity-50"
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Leverage slider */}
        <LeverageSlider value={leverage} onChange={setLeverage} />

        {/* Calculations */}
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex justify-between text-xs">
            <span className="text-text-secondary">Entry Price</span>
            <span className="text-text-primary font-medium">
              {formatCents(orderType === 'limit' && limitPrice ? parseFloat(limitPrice) : currentPrice)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-secondary">Margin Required</span>
            <span className="text-text-primary font-medium">
              {formatPrice(calculations.margin)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-secondary">Est. Shares</span>
            <span className="text-text-primary font-medium">
              {calculations.shares.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-secondary">Potential Profit</span>
            <span className="text-accent-green font-medium">
              +{formatPrice(calculations.potentialProfit)} ({calculations.roi.toFixed(1)}%)
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-secondary">Fee</span>
            <span className="text-text-primary font-medium">
              {formatPrice(calculations.fee)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-text-secondary flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-accent-yellow" />
              Liquidation Price
            </span>
            <span className="text-accent-red font-medium">
              {formatCents(calculations.liquidationPrice)}
            </span>
          </div>
        </div>

        {/* Warning for high leverage */}
        {leverage >= 20 && (
          <div className="flex items-start gap-2 p-3 bg-accent-yellow/10 border border-accent-yellow/30 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-accent-yellow flex-shrink-0 mt-0.5" />
            <p className="text-xs text-accent-yellow">
              High leverage increases liquidation risk. Trade carefully.
            </p>
          </div>
        )}

        {/* Submit button */}
        <Button
          onClick={handleSubmit}
          loading={loading}
          disabled={!size || parseFloat(size) <= 0}
          variant={side === 'YES' ? 'success' : 'danger'}
          size="lg"
          className="w-full"
        >
          <Zap className="w-4 h-4" />
          {side === 'YES' ? 'Long' : 'Short'} with {leverage}x
        </Button>

        {!isAuthenticated && (
          <p className="text-xs text-text-secondary text-center">
            Connect wallet to trade
          </p>
        )}
      </div>
    </div>
  )
}
