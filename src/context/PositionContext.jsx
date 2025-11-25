import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { calculatePnL, calculateLiquidationPrice, calculateROI } from '../utils/formatters'

const PositionContext = createContext(null)

export function PositionProvider({ children }) {
  const { user, updateBalance } = useAuth()
  const [positions, setPositions] = useState([])
  const [orders, setOrders] = useState([])
  const [tradeHistory, setTradeHistory] = useState([])

  // Load positions from localStorage
  useEffect(() => {
    if (user) {
      const savedPositions = localStorage.getItem(`polyperps_positions_${user.id}`)
      const savedOrders = localStorage.getItem(`polyperps_orders_${user.id}`)
      const savedHistory = localStorage.getItem(`polyperps_history_${user.id}`)

      if (savedPositions) setPositions(JSON.parse(savedPositions))
      if (savedOrders) setOrders(JSON.parse(savedOrders))
      if (savedHistory) setTradeHistory(JSON.parse(savedHistory))
    } else {
      setPositions([])
      setOrders([])
      setTradeHistory([])
    }
  }, [user])

  // Save to localStorage when changed
  useEffect(() => {
    if (user) {
      localStorage.setItem(`polyperps_positions_${user.id}`, JSON.stringify(positions))
      localStorage.setItem(`polyperps_orders_${user.id}`, JSON.stringify(orders))
      localStorage.setItem(`polyperps_history_${user.id}`, JSON.stringify(tradeHistory))
    }
  }, [positions, orders, tradeHistory, user])

  const openPosition = (market, side, size, leverage, entryPrice) => {
    if (!user) throw new Error('Must be logged in')

    const margin = size / leverage
    if (margin > user.balance) {
      throw new Error('Insufficient balance')
    }

    const newPosition = {
      id: Date.now().toString(),
      marketId: market.id,
      marketQuestion: market.question,
      marketSlug: market.slug,
      side, // 'YES' or 'NO'
      size,
      leverage,
      entryPrice,
      margin,
      liquidationPrice: calculateLiquidationPrice(entryPrice, leverage, side),
      openedAt: new Date().toISOString(),
    }

    setPositions(prev => [...prev, newPosition])
    updateBalance(user.balance - margin)

    // Add to trade history
    const trade = {
      id: Date.now().toString(),
      type: 'OPEN',
      marketQuestion: market.question,
      side,
      size,
      leverage,
      price: entryPrice,
      timestamp: new Date().toISOString(),
    }
    setTradeHistory(prev => [trade, ...prev])

    return newPosition
  }

  const closePosition = (positionId, currentPrice) => {
    const position = positions.find(p => p.id === positionId)
    if (!position) throw new Error('Position not found')

    const pnl = calculatePnL(
      position.entryPrice,
      currentPrice,
      position.size,
      position.leverage,
      position.side
    )

    const returnAmount = position.margin + pnl
    updateBalance(user.balance + returnAmount)

    // Add to trade history
    const trade = {
      id: Date.now().toString(),
      type: 'CLOSE',
      marketQuestion: position.marketQuestion,
      side: position.side,
      size: position.size,
      leverage: position.leverage,
      entryPrice: position.entryPrice,
      exitPrice: currentPrice,
      pnl,
      roi: calculateROI(pnl, position.margin),
      timestamp: new Date().toISOString(),
    }
    setTradeHistory(prev => [trade, ...prev])

    // Remove position
    setPositions(prev => prev.filter(p => p.id !== positionId))

    return { pnl, returnAmount }
  }

  const placeLimitOrder = (market, side, size, leverage, limitPrice) => {
    if (!user) throw new Error('Must be logged in')

    const margin = size / leverage
    if (margin > user.balance) {
      throw new Error('Insufficient balance')
    }

    const newOrder = {
      id: Date.now().toString(),
      marketId: market.id,
      marketQuestion: market.question,
      marketSlug: market.slug,
      side,
      size,
      leverage,
      limitPrice,
      margin,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    }

    setOrders(prev => [...prev, newOrder])
    updateBalance(user.balance - margin)

    return newOrder
  }

  const cancelOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId)
    if (!order) throw new Error('Order not found')

    // Return margin
    updateBalance(user.balance + order.margin)

    // Remove order
    setOrders(prev => prev.filter(o => o.id !== orderId))
  }

  const getPositionPnL = (position, currentPrice) => {
    return calculatePnL(
      position.entryPrice,
      currentPrice,
      position.size,
      position.leverage,
      position.side
    )
  }

  const getTotalUnrealizedPnL = (currentPrices) => {
    return positions.reduce((total, position) => {
      const currentPrice = currentPrices[position.marketId] || position.entryPrice
      return total + getPositionPnL(position, currentPrice)
    }, 0)
  }

  const value = {
    positions,
    orders,
    tradeHistory,
    openPosition,
    closePosition,
    placeLimitOrder,
    cancelOrder,
    getPositionPnL,
    getTotalUnrealizedPnL,
  }

  return (
    <PositionContext.Provider value={value}>
      {children}
    </PositionContext.Provider>
  )
}

export function usePositions() {
  const context = useContext(PositionContext)
  if (!context) {
    throw new Error('usePositions must be used within PositionProvider')
  }
  return context
}
