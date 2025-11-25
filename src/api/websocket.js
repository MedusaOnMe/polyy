// Polymarket WebSocket for real-time price updates

const WS_URL = 'wss://ws-subscriptions-clob.polymarket.com/ws/market'

class PolymarketWebSocket {
  constructor() {
    this.ws = null
    this.subscriptions = new Set()
    this.handlers = new Map()
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.pingInterval = null
    this.isConnecting = false
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve()
        return
      }

      if (this.isConnecting) {
        // Wait for existing connection attempt
        const checkConnection = setInterval(() => {
          if (this.ws?.readyState === WebSocket.OPEN) {
            clearInterval(checkConnection)
            resolve()
          }
        }, 100)
        return
      }

      this.isConnecting = true
      console.log('[WS] Connecting to Polymarket...')

      try {
        this.ws = new WebSocket(WS_URL)
      } catch (e) {
        this.isConnecting = false
        reject(e)
        return
      }

      this.ws.onopen = () => {
        console.log('[WS] Connected')
        this.isConnecting = false
        this.reconnectAttempts = 0

        // Resubscribe to all tokens
        this.subscriptions.forEach(id => this.sendSubscription(id))

        // Keep-alive ping every 30s
        this.pingInterval = setInterval(() => {
          if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'ping' }))
          }
        }, 30000)

        resolve()
      }

      this.ws.onmessage = (event) => {
        try {
          const messages = JSON.parse(event.data)
          const arr = Array.isArray(messages) ? messages : [messages]

          arr.forEach((msg) => {
            if (msg.asset_id) {
              // Call handlers for this specific token
              this.handlers.get(msg.asset_id)?.forEach(h => h(msg))
              // Call wildcard handlers
              this.handlers.get('*')?.forEach(h => h(msg))
            }
          })
        } catch (e) {
          // Ignore parse errors (often just pong responses)
        }
      }

      this.ws.onclose = () => {
        console.log('[WS] Disconnected')
        this.isConnecting = false
        if (this.pingInterval) {
          clearInterval(this.pingInterval)
          this.pingInterval = null
        }
        this.attemptReconnect()
      }

      this.ws.onerror = (err) => {
        console.error('[WS] Error:', err)
        this.isConnecting = false
        reject(err)
      }
    })
  }

  sendSubscription(tokenId) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('[WS] Subscribing to:', tokenId.slice(0, 30) + '...')
      this.ws.send(JSON.stringify({
        type: 'Market',
        assets_ids: [tokenId],
      }))
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('[WS] Max reconnect attempts reached')
      return
    }

    this.reconnectAttempts++
    const delay = 1000 * Math.pow(2, this.reconnectAttempts - 1)
    console.log(`[WS] Reconnecting in ${delay}ms...`)

    setTimeout(() => {
      this.connect().catch(console.error)
    }, delay)
  }

  subscribe(tokenId, handler) {
    if (!tokenId || tokenId.startsWith('mock-')) {
      return () => {} // No-op unsubscribe for mock tokens
    }

    this.subscriptions.add(tokenId)

    if (!this.handlers.has(tokenId)) {
      this.handlers.set(tokenId, new Set())
    }
    this.handlers.get(tokenId).add(handler)

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.sendSubscription(tokenId)
    } else {
      this.connect().catch(console.error)
    }

    // Return unsubscribe function
    return () => {
      this.handlers.get(tokenId)?.delete(handler)
      if (this.handlers.get(tokenId)?.size === 0) {
        this.handlers.delete(tokenId)
        this.subscriptions.delete(tokenId)
      }
    }
  }

  disconnect() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
    this.ws?.close()
    this.ws = null
    this.subscriptions.clear()
    this.handlers.clear()
    this.isConnecting = false
  }
}

// Singleton instance
export const polymarketWS = new PolymarketWebSocket()

// Helper hook for React components
export function subscribeToMarket(tokenId, onPriceChange, onBookUpdate) {
  return polymarketWS.subscribe(tokenId, (msg) => {
    if (msg.event_type === 'price_change' && onPriceChange) {
      onPriceChange(parseFloat(msg.price))
    }
    if (msg.event_type === 'book' && onBookUpdate) {
      const bids = (msg.bids || [])
        .map(b => ({
          price: parseFloat(b.price) || 0,
          size: parseFloat(b.size) || 0,
        }))
        .filter(b => b.price > 0 && b.size > 0)
        .sort((a, b) => b.price - a.price) // Sort bids highest first

      const asks = (msg.asks || [])
        .map(a => ({
          price: parseFloat(a.price) || 0,
          size: parseFloat(a.size) || 0,
        }))
        .filter(a => a.price > 0 && a.size > 0)
        .sort((a, b) => a.price - b.price) // Sort asks lowest first

      onBookUpdate({ bids, asks })
    }
  })
}
