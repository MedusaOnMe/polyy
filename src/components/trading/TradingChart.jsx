import { useEffect, useRef, useState } from 'react'
import { createChart } from 'lightweight-charts'
import { ChevronDown, Search } from 'lucide-react'
import { useMarket } from '../../context/MarketContext'
import { TIMEFRAMES } from '../../utils/constants'
import { formatCents, formatChange } from '../../utils/formatters'

export function TradingChart() {
  const chartContainerRef = useRef(null)
  const chartRef = useRef(null)
  const seriesRef = useRef(null)
  const [chartReady, setChartReady] = useState(false)
  const [showMarketDropdown, setShowMarketDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const {
    markets,
    selectedMarket,
    selectMarket,
    priceHistory,
    isLoading,
    selectedTimeframe,
    setSelectedTimeframe,
    getCurrentPrice,
    get24hChange,
  } = useMarket()

  // Filter markets by search
  const filteredMarkets = markets.filter(m =>
    m.question.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Initialize chart with modern theme
  useEffect(() => {
    if (!chartContainerRef.current || !selectedMarket) {
      return
    }

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: 'solid', color: '#161b22' },
        textColor: '#8b949e',
        fontFamily: 'Inter, sans-serif',
      },
      grid: {
        vertLines: { color: '#21262d' },
        horzLines: { color: '#21262d' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight || 300,
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#3b82f6',
          width: 1,
          style: 0,
          labelBackgroundColor: '#3b82f6',
        },
        horzLine: {
          color: '#3b82f6',
          width: 1,
          style: 0,
          labelBackgroundColor: '#3b82f6',
        },
      },
      rightPriceScale: {
        borderColor: '#30363d',
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: '#30363d',
        timeVisible: true,
        secondsVisible: false,
      },
    })

    chartRef.current = chart

    // Create area series with modern green
    const areaSeries = chart.addAreaSeries({
      lineColor: '#22c55e',
      topColor: 'rgba(34, 197, 94, 0.15)',
      bottomColor: 'rgba(34, 197, 94, 0.0)',
      lineWidth: 2,
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    })

    seriesRef.current = areaSeries
    setChartReady(true)

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        const { clientWidth, clientHeight } = chartContainerRef.current
        if (clientWidth > 0 && clientHeight > 0) {
          chart.applyOptions({
            width: clientWidth,
            height: clientHeight,
          })
        }
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(chartContainerRef.current)
    setTimeout(handleResize, 100)

    return () => {
      resizeObserver.disconnect()
      chart.remove()
      setChartReady(false)
    }
  }, [selectedMarket])

  // Update data when price history changes
  useEffect(() => {
    if (!chartReady || !seriesRef.current || !chartRef.current) {
      return
    }

    if (!priceHistory || priceHistory.length === 0) {
      return
    }

    const dataMap = new Map()
    priceHistory.forEach(point => {
      const time = Math.floor(Number(point.time))
      const value = Number(point.value)
      if (time > 0 && !isNaN(time) && value > 0 && !isNaN(value)) {
        dataMap.set(time, { time, value })
      }
    })

    const data = Array.from(dataMap.values()).sort((a, b) => a.time - b.time)

    if (data.length === 0) {
      return
    }

    try {
      seriesRef.current.setData(data)

      const isPositive = data.length >= 2
        ? data[data.length - 1].value >= data[0].value
        : true

      seriesRef.current.applyOptions({
        lineColor: isPositive ? '#22c55e' : '#ef4444',
        topColor: isPositive ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
        bottomColor: isPositive ? 'rgba(34, 197, 94, 0.0)' : 'rgba(239, 68, 68, 0.0)',
      })

      chartRef.current.timeScale().fitContent()
    } catch (e) {
      console.error('[Chart] Error setting data:', e)
    }
  }, [priceHistory, chartReady])

  const currentPrice = getCurrentPrice()
  const change24h = get24hChange()
  const isPositive = change24h >= 0

  if (!selectedMarket) {
    return (
      <div className="bg-bg-secondary border border-border rounded-lg h-full flex items-center justify-center">
        <div className="text-sm text-text-muted">
          Select a market to start trading
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg-secondary border border-border rounded-lg overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Market selector */}
            <div className="relative">
              <button
                onClick={() => setShowMarketDropdown(!showMarketDropdown)}
                className="flex items-center gap-2 text-left group"
              >
                <span className="text-base text-text-primary font-semibold truncate max-w-[500px] group-hover:text-accent-blue transition-colors">
                  {selectedMarket.question}
                </span>
                <ChevronDown className={`w-8 h-8 text-text-primary transition-transform ${showMarketDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Market dropdown */}
              {showMarketDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMarketDropdown(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-[600px] max-h-[500px] bg-bg-secondary border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                    {/* Search */}
                    <div className="p-4 border-b border-border">
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search markets..."
                          autoFocus
                          className="w-full bg-bg-primary border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-blue focus:outline-none"
                        />
                      </div>
                    </div>
                    {/* Markets list */}
                    <div className="max-h-[420px] overflow-y-auto">
                      {filteredMarkets.map((market, index) => (
                        <button
                          key={market.id}
                          onClick={() => {
                            selectMarket(market)
                            setShowMarketDropdown(false)
                            setSearchQuery('')
                          }}
                          className={`w-full px-4 py-4 text-left hover:bg-bg-elevated transition-colors flex items-center justify-between gap-6 ${
                            selectedMarket?.id === market.id ? 'bg-accent-blue/10 border-l-2 border-l-accent-blue' : ''
                          } ${index !== filteredMarkets.length - 1 ? 'border-b border-border/50' : ''}`}
                        >
                          <span className="text-sm text-text-primary leading-relaxed flex-1">
                            {market.question}
                          </span>
                          <span className="font-mono text-base font-semibold text-accent-green shrink-0 bg-accent-green/10 px-2.5 py-1 rounded">
                            {formatCents(market.yesPrice || 0.5)}
                          </span>
                        </button>
                      ))}
                      {filteredMarkets.length === 0 && (
                        <div className="px-4 py-12 text-center text-sm text-text-muted">
                          No markets found
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-1">
              <span className={`text-3xl font-mono font-semibold ${isPositive ? 'text-accent-green' : 'text-accent-red'}`}>
                {formatCents(currentPrice)}
              </span>
              <span className={`text-sm font-medium px-2 py-0.5 rounded ${
                isPositive
                  ? 'text-accent-green bg-accent-green/10'
                  : 'text-accent-red bg-accent-red/10'
              }`}>
                {formatChange(change24h)}
              </span>
            </div>
          </div>

          {/* Timeframe selector - moved to right side */}
          <div className="flex items-center gap-1">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.label}
                onClick={() => setSelectedTimeframe(tf.interval)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedTimeframe === tf.interval
                    ? 'text-text-primary bg-bg-elevated'
                    : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated/50'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative flex-1" style={{ minHeight: '250px' }}>
        {isLoading && (
          <div className="absolute inset-0 bg-bg-secondary/80 flex items-center justify-center z-10">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-text-secondary">Loading...</span>
            </div>
          </div>
        )}
        <div ref={chartContainerRef} className="absolute inset-0" />
      </div>

      {/* Bottom stats */}
      <div className="px-4 py-2.5 border-t border-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-4 text-text-secondary">
          <span>
            High: <span className="font-mono text-accent-green">
              {formatCents(priceHistory.length > 0 ? Math.max(...priceHistory.map(p => p.value)) : currentPrice)}
            </span>
          </span>
          <span>
            Low: <span className="font-mono text-accent-red">
              {formatCents(priceHistory.length > 0 ? Math.min(...priceHistory.map(p => p.value)) : currentPrice)}
            </span>
          </span>
        </div>
        <span className="text-text-muted">
          {priceHistory.length} data points
        </span>
      </div>
    </div>
  )
}
