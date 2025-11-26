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

  // Strip markdown links and clean up text
  const cleanText = (text) => {
    if (!text) return text
    return text
      // Remove markdown links [text](url) -> text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove bare URLs
      .replace(/https?:\/\/[^\s)]+/g, '')
      // Remove parentheses left over from removed URLs
      .replace(/\(\s*\)/g, '')
      // Clean up extra whitespace
      .replace(/\s+/g, ' ')
      .trim()
  }

  // Parse the structured analysis
  const parseAnalysis = (text) => {
    if (!text) return null

    // Parse structured format: NEWS, AI ESTIMATE, VERDICT, CONFIDENCE
    const newsMatch = text.match(/NEWS:\s*(.+?)(?=AI ESTIMATE:|$)/is)
    const estimateMatch = text.match(/AI ESTIMATE:\s*(\d{1,3})%/i)
    const verdictMatch = text.match(/VERDICT:\s*(Undervalued|Fair|Overvalued)/i)
    const confidenceMatch = text.match(/CONFIDENCE:\s*(Low|Medium|High)/i)

    const news = newsMatch ? cleanText(newsMatch[1]) : null
    const estimate = estimateMatch ? parseInt(estimateMatch[1]) : null
    const verdict = verdictMatch ? verdictMatch[1].toLowerCase() : null
    const confidence = confidenceMatch ? confidenceMatch[1].toLowerCase() : null

    // Map verdict to sentiment
    let sentiment = 'neutral'
    if (verdict === 'undervalued') sentiment = 'bullish'
    else if (verdict === 'overvalued') sentiment = 'bearish'

    return { news, estimate, verdict, confidence, sentiment }
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
        ) : parsed ? (
          <div className="space-y-3">
            {/* Stats row */}
            <div className="flex items-center gap-3 flex-wrap">
              {parsed.estimate && (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-text-muted">AI:</span>
                  <span className="font-mono text-base font-semibold text-text-primary">
                    {parsed.estimate}%
                  </span>
                </div>
              )}
              {parsed.verdict && (
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                  parsed.sentiment === 'bullish'
                    ? 'bg-accent-green/15 text-accent-green'
                    : parsed.sentiment === 'bearish'
                    ? 'bg-accent-red/15 text-accent-red'
                    : 'bg-bg-elevated text-text-secondary'
                }`}>
                  {parsed.sentiment === 'bullish' ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : parsed.sentiment === 'bearish' ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : (
                    <Minus className="w-3 h-3" />
                  )}
                  {parsed.verdict.charAt(0).toUpperCase() + parsed.verdict.slice(1)}
                </div>
              )}
              {parsed.confidence && (
                <span className="text-xs text-text-muted">
                  {parsed.confidence.charAt(0).toUpperCase() + parsed.confidence.slice(1)} confidence
                </span>
              )}
            </div>

            {/* News */}
            {parsed.news && (
              <p className="text-sm text-text-secondary leading-relaxed">
                {parsed.news}
              </p>
            )}

            {/* Disclaimer */}
            <p className="text-xs text-text-muted pt-2 border-t border-border">
              AI analysis is for informational purposes only.
            </p>
          </div>
        ) : (
          <div className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
            {analysis}
          </div>
        )}
      </div>
    </div>
  )
}
