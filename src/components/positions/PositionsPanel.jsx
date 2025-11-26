import { useState, useEffect } from 'react'
import { X, TrendingUp, Clock, History, AlertTriangle } from 'lucide-react'
import { usePositions } from '../../context/PositionContext'
import { useMarket } from '../../context/MarketContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { Tabs } from '../ui/Tabs'
import { Button } from '../ui/Button'
import { formatCents, formatPrice, formatPnL, formatTimeAgo, calculatePnL, calculateROI } from '../../utils/formatters'

export function PositionsPanel() {
  const { positions, orders, tradeHistory, closePosition, cancelOrder } = usePositions()
  const { isAuthenticated } = useAuth()

  const tabs = [
    {
      id: 'positions',
      label: 'Positions',
      icon: <TrendingUp className="w-4 h-4" />,
      count: positions.length,
      content: <PositionsList />,
    },
    {
      id: 'orders',
      label: 'Open Orders',
      icon: <Clock className="w-4 h-4" />,
      count: orders.length,
      content: <OrdersList />,
    },
    {
      id: 'history',
      label: 'Trade History',
      icon: <History className="w-4 h-4" />,
      content: <TradeHistoryList />,
    },
  ]

  if (!isAuthenticated) {
    return (
      <div className="bg-bg-secondary border border-border rounded-lg p-8">
        <div className="text-center text-sm text-text-muted">
          Connect your wallet to view positions
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg-secondary border border-border rounded-lg">
      <Tabs tabs={tabs} defaultTab="positions" />
    </div>
  )
}

function PositionsList() {
  const { positions, closePosition, getPositionPnL } = usePositions()
  const { markets, getCurrentPrice } = useMarket()
  const toast = useToast()
  const [closingId, setClosingId] = useState(null)

  // Simulated live price updates
  const [prices, setPrices] = useState({})

  useEffect(() => {
    // Initialize prices
    const initial = {}
    positions.forEach(p => {
      initial[p.marketId] = p.entryPrice + (Math.random() - 0.5) * 0.1
    })
    setPrices(initial)

    // Update prices periodically
    const interval = setInterval(() => {
      setPrices(prev => {
        const updated = { ...prev }
        positions.forEach(p => {
          const current = updated[p.marketId] || p.entryPrice
          const change = (Math.random() - 0.48) * 0.02
          updated[p.marketId] = Math.max(0.01, Math.min(0.99, current + change))
        })
        return updated
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [positions])

  const handleClose = async (position) => {
    setClosingId(position.id)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      const currentPrice = prices[position.marketId] || position.entryPrice
      const result = closePosition(position.id, currentPrice)

      if (result.pnl >= 0) {
        toast.success(`Position closed! Profit: +$${result.pnl.toFixed(2)}`)
      } else {
        toast.warning(`Position closed. Loss: -$${Math.abs(result.pnl).toFixed(2)}`)
      }
    } catch (err) {
      toast.error('Failed to close position')
    } finally {
      setClosingId(null)
    }
  }

  if (positions.length === 0) {
    return (
      <div className="p-8 text-center text-text-muted">
        <TrendingUp className="w-8 h-8 mx-auto mb-3 opacity-30" />
        <p className="text-sm font-medium">No open positions</p>
        <p className="text-xs mt-1">Open a trade to see it here</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {positions.map((position) => {
        const currentPrice = prices[position.marketId] || position.entryPrice
        const pnl = getPositionPnL(position, currentPrice)
        const roi = calculateROI(pnl, position.margin)
        const pnlFormatted = formatPnL(pnl)

        // Check if near liquidation
        const priceToLiq = position.side === 'YES'
          ? currentPrice - position.liquidationPrice
          : position.liquidationPrice - currentPrice
        const isNearLiquidation = priceToLiq < 0.05

        return (
          <div key={position.id} className="p-4 hover:bg-bg-elevated/50 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    position.side === 'YES'
                      ? 'bg-accent-green/15 text-accent-green'
                      : 'bg-accent-red/15 text-accent-red'
                  }`}>
                    {position.side === 'YES' ? 'Long' : 'Short'} {position.leverage}x
                  </span>
                  {isNearLiquidation && (
                    <span className="flex items-center gap-1 px-2 py-1 text-xs bg-accent-amber/15 text-accent-amber rounded">
                      <AlertTriangle className="w-3 h-3" />
                      At risk
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-primary truncate">
                  {position.marketQuestion}
                </p>
              </div>

              <div className="text-right">
                <p className={`text-lg font-mono font-semibold ${pnl >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                  {pnlFormatted.text}
                </p>
                <p className={`text-xs font-mono ${pnl >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                  {roi >= 0 ? '+' : ''}{roi.toFixed(2)}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-3 text-xs">
              <div>
                <span className="text-text-muted">Size</span>
                <p className="font-mono text-text-primary">{formatPrice(position.size)}</p>
              </div>
              <div>
                <span className="text-text-muted">Entry</span>
                <p className="font-mono text-text-primary">{formatCents(position.entryPrice)}</p>
              </div>
              <div>
                <span className="text-text-muted">Mark</span>
                <p className={`font-mono ${currentPrice > position.entryPrice ? 'text-accent-green' : 'text-accent-red'}`}>
                  {formatCents(currentPrice)}
                </p>
              </div>
              <div>
                <span className="text-text-muted">Liquidation</span>
                <p className="font-mono text-accent-red">{formatCents(position.liquidationPrice)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <span className="text-xs text-text-muted">
                {formatTimeAgo(position.openedAt)}
              </span>
              <Button
                onClick={() => handleClose(position)}
                loading={closingId === position.id}
                variant="ghost"
                size="sm"
              >
                <X className="w-3 h-3" />
                Close
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function OrdersList() {
  const { orders, cancelOrder } = usePositions()
  const toast = useToast()
  const [cancellingId, setCancellingId] = useState(null)

  const handleCancel = async (order) => {
    setCancellingId(order.id)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      cancelOrder(order.id)
      toast.success('Order cancelled')
    } catch (err) {
      toast.error('Failed to cancel order')
    } finally {
      setCancellingId(null)
    }
  }

  if (orders.length === 0) {
    return (
      <div className="p-8 text-center text-text-muted">
        <Clock className="w-8 h-8 mx-auto mb-3 opacity-30" />
        <p className="text-sm font-medium">No open orders</p>
        <p className="text-xs mt-1">Place a limit order to see it here</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {orders.map((order) => (
        <div key={order.id} className="p-4 hover:bg-bg-elevated/50 transition-colors">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  order.side === 'YES'
                    ? 'bg-accent-green/15 text-accent-green'
                    : 'bg-accent-red/15 text-accent-red'
                }`}>
                  {order.side === 'YES' ? 'Long' : 'Short'} {order.leverage}x Limit
                </span>
              </div>
              <p className="text-sm text-text-primary truncate">
                {order.marketQuestion}
              </p>
            </div>
            <Button
              onClick={() => handleCancel(order)}
              loading={cancellingId === order.id}
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-3 text-xs">
            <div>
              <span className="text-text-muted">Size</span>
              <p className="font-mono text-text-primary">{formatPrice(order.size)}</p>
            </div>
            <div>
              <span className="text-text-muted">Limit Price</span>
              <p className="font-mono text-accent-blue">{formatCents(order.limitPrice)}</p>
            </div>
            <div>
              <span className="text-text-muted">Margin</span>
              <p className="font-mono text-text-primary">{formatPrice(order.margin)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function TradeHistoryList() {
  const { tradeHistory } = usePositions()

  if (tradeHistory.length === 0) {
    return (
      <div className="p-8 text-center text-text-muted">
        <History className="w-8 h-8 mx-auto mb-3 opacity-30" />
        <p className="text-sm font-medium">No trade history</p>
        <p className="text-xs mt-1">Your closed trades will appear here</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {tradeHistory.map((trade) => {
        const pnlFormatted = trade.pnl !== undefined ? formatPnL(trade.pnl) : null

        return (
          <div key={trade.id} className="p-4 hover:bg-bg-elevated/50 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    trade.type === 'OPEN' ? 'bg-accent-blue/15 text-accent-blue' : 'bg-bg-elevated text-text-muted'
                  }`}>
                    {trade.type}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    trade.side === 'YES'
                      ? 'bg-accent-green/15 text-accent-green'
                      : 'bg-accent-red/15 text-accent-red'
                  }`}>
                    {trade.side === 'YES' ? 'Long' : 'Short'} {trade.leverage}x
                  </span>
                </div>
                <p className="text-sm text-text-primary truncate">
                  {trade.marketQuestion}
                </p>
              </div>

              {pnlFormatted && (
                <div className="text-right">
                  <p className={`text-lg font-mono font-semibold ${trade.pnl >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                    {pnlFormatted.text}
                  </p>
                  <p className={`text-xs font-mono ${trade.pnl >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                    {trade.roi >= 0 ? '+' : ''}{trade.roi?.toFixed(2)}%
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-3 text-xs text-text-muted">
              <div className="flex items-center gap-4 font-mono">
                <span>Size: {formatPrice(trade.size)}</span>
                {trade.entryPrice && <span>Entry: {formatCents(trade.entryPrice)}</span>}
                {trade.exitPrice && <span>Exit: {formatCents(trade.exitPrice)}</span>}
              </div>
              <span>{formatTimeAgo(trade.timestamp)}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
