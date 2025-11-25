import { Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Shield, Target, BookOpen, Zap } from 'lucide-react'

export function Docs() {
  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="bg-secondary border-b border-border sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Link to="/" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Trading
            </Link>
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="PolyPerps" className="w-8 h-8" />
              <span className="text-xl font-bold text-white">PolyPerps</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Documentation</h1>
          <p className="text-text-secondary text-lg">
            Everything you need to know about trading perpetuals on prediction markets
          </p>
        </div>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-accent-green" />
            Quick Start
          </h2>
          <div className="bg-secondary rounded-lg border border-border p-6 space-y-4">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent-green/20 text-accent-green flex items-center justify-center font-bold shrink-0">1</div>
              <div>
                <h3 className="font-semibold text-text-primary">Create an Account</h3>
                <p className="text-text-secondary text-sm">Sign up with your email and password to get started.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent-green/20 text-accent-green flex items-center justify-center font-bold shrink-0">2</div>
              <div>
                <h3 className="font-semibold text-text-primary">Select a Market</h3>
                <p className="text-text-secondary text-sm">Browse live prediction markets from the sidebar. Markets show real-time prices and volume.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-accent-green/20 text-accent-green flex items-center justify-center font-bold shrink-0">3</div>
              <div>
                <h3 className="font-semibold text-text-primary">Open a Position</h3>
                <p className="text-text-secondary text-sm">Choose YES or NO, set your position size and leverage (up to 25x), then execute your trade.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-accent-blue" />
            How Perpetuals Work
          </h2>
          <div className="bg-secondary rounded-lg border border-border p-6">
            <p className="text-text-secondary mb-4">
              Perpetual contracts let you speculate on prediction market outcomes with leverage. Unlike spot trading, you don't need the full amount upfront.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-accent-green flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Going Long (YES)
                </h3>
                <p className="text-text-secondary text-sm">
                  You profit when the probability increases. If a market is at 40% and rises to 60%, a 10x leveraged long would return 50% profit.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-accent-red flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 rotate-180" /> Going Short (NO)
                </h3>
                <p className="text-text-secondary text-sm">
                  You profit when the probability decreases. If a market is at 60% and falls to 40%, a 10x leveraged short would return 33% profit.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Leverage */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-accent-purple" />
            Leverage & Liquidation
          </h2>
          <div className="bg-secondary rounded-lg border border-border p-6 space-y-4">
            <div>
              <h3 className="font-semibold text-text-primary mb-2">Available Leverage</h3>
              <p className="text-text-secondary text-sm">
                Trade with 1x to 25x leverage. Higher leverage amplifies both gains and losses.
              </p>
              <div className="flex gap-2 mt-3 flex-wrap">
                {[1, 2, 3, 5, 10, 15, 20, 25].map(l => (
                  <span key={l} className="px-3 py-1 bg-tertiary rounded text-text-primary text-sm font-mono">{l}x</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary mb-2">Liquidation</h3>
              <p className="text-text-secondary text-sm">
                Positions are liquidated when losses exceed your margin. At 25x leverage, a 4% adverse move triggers liquidation. Always use appropriate position sizing.
              </p>
            </div>
          </div>
        </section>

        {/* Risk */}
        <section>
          <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-accent-red" />
            Risk Warning
          </h2>
          <div className="bg-accent-red/10 border border-accent-red/20 rounded-lg p-6">
            <p className="text-text-primary">
              Leveraged trading involves significant risk. You can lose more than your initial deposit. Only trade with funds you can afford to lose. Past performance is not indicative of future results.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
