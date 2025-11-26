import { useState, useEffect } from 'react'
import { Sparkles, RefreshCw, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useMarket } from '../../context/MarketContext'
import { Button } from '../ui/Button'

export function AIAnalysis() {
  const { selectedMarket, getCurrentPrice } = useMarket()
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Reset when market changes
  useEffect(() => {
    setAnalysis(null)
    setError(null)
  }, [selectedMarket?.id])

  const fetchAnalysis = async () => {
    if (!selectedMarket) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: selectedMarket.question,
          currentPrice: getCurrentPrice(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch analysis')
      }

      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (err) {
      console.error('AI Analysis error:', err)
      setError('Unable to generate analysis. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Parse the analysis to extract key info
  const parseAnalysis = (text) => {
    if (!text) return null

    // Try to extract probability assessment
    const probMatch = text.match(/(\d{1,3})%\s*probability/i) || text.match(/assessment[:\s]*(\d{1,3})%/i)
    const probability = probMatch ? parseInt(probMatch[1]) : null

    // Try to detect sentiment
    const lowerText = text.toLowerCase()
    let sentiment = 'neutral'
    if (lowerText.includes('undervalued') || lowerText.includes('bullish')) {
      sentiment = 'bullish'
    } else if (lowerText.includes('overvalued') || lowerText.includes('bearish')) {
      sentiment = 'bearish'
    }

    return { probability, sentiment }
  }

  const parsed = parseAnalysis(analysis)

  return (
    <div className="bg-bg-secondary border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-amber" />
          <span className="text-sm font-medium text-text-primary">AI Analysis</span>
          <span className="text-xs text-text-muted px-1.5 py-0.5 bg-bg-elevated rounded">Beta</span>
        </div>
        <Button
          onClick={fetchAnalysis}
          disabled={loading || !selectedMarket}
          variant="ghost"
          size="sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {analysis ? 'Refresh' : 'Analyze'}
        </Button>
      </div>

      {/* Content */}
      <div className="p-4">
        {!selectedMarket ? (
          <p className="text-sm text-text-muted text-center py-4">
            Select a market to analyze
          </p>
        ) : !analysis && !loading && !error ? (
          <div className="text-center py-6">
            <Sparkles className="w-8 h-8 text-text-muted mx-auto mb-3 opacity-30" />
            <p className="text-sm text-text-muted mb-3">
              Get AI-powered analysis with web search
            </p>
            <Button onClick={fetchAnalysis} variant="outline" size="sm">
              <Sparkles className="w-3.5 h-3.5" />
              Generate Analysis
            </Button>
          </div>
        ) : loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-accent-amber/30 border-t-accent-amber rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-text-muted">Searching and analyzing...</p>
          </div>
        ) : error ? (
          <div className="flex items-start gap-3 p-3 bg-accent-red/10 border border-accent-red/30 rounded-lg">
            <AlertCircle className="w-4 h-4 text-accent-red shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-accent-red">{error}</p>
              <button
                onClick={fetchAnalysis}
                className="text-xs text-accent-red underline mt-1"
              >
                Try again
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Sentiment indicator */}
            {parsed && (
              <div className="flex items-center gap-4">
                {parsed.probability && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">AI Est:</span>
                    <span className="font-mono text-lg font-semibold text-text-primary">
                      {parsed.probability}%
                    </span>
                  </div>
                )}
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${
                  parsed.sentiment === 'bullish'
                    ? 'bg-accent-green/15 text-accent-green'
                    : parsed.sentiment === 'bearish'
                    ? 'bg-accent-red/15 text-accent-red'
                    : 'bg-bg-elevated text-text-muted'
                }`}>
                  {parsed.sentiment === 'bullish' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : parsed.sentiment === 'bearish' ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <Minus className="w-3 h-3" />
                  )}
                  {parsed.sentiment.charAt(0).toUpperCase() + parsed.sentiment.slice(1)}
                </div>
              </div>
            )}

            {/* Analysis text */}
            <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
              {analysis}
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-text-muted pt-2 border-t border-border">
              AI analysis is for informational purposes only. Do your own research.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
