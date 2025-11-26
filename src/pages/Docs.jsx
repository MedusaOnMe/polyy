import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, Shield, Target, BookOpen, Zap, ChevronRight, DollarSign, AlertTriangle } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'quickstart', label: 'Quick Start', icon: Zap },
  { id: 'trading', label: 'Trading', icon: TrendingUp },
  { id: 'leverage', label: 'Leverage', icon: Target },
  { id: 'risk', label: 'Risk', icon: Shield },
]

export function Docs() {
  const [activeSection, setActiveSection] = useState('overview')

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="bg-bg-secondary border-b border-border sticky top-0 z-40">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent-green" />
              <span className="text-lg font-semibold text-text-primary">PolyPerp</span>
            </Link>
            <span className="text-text-muted text-sm hidden sm:inline">Documentation</span>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-1.5 bg-bg-elevated hover:bg-border rounded-md text-text-secondary hover:text-text-primary transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Trade
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="hidden md:block w-56 border-r border-border min-h-[calc(100vh-56px)] bg-bg-secondary">
          <nav className="p-4">
            <div className="text-xs text-text-muted uppercase tracking-wide mb-3 px-2">
              Navigation
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-md transition-colors mb-1 ${
                    activeSection === item.id
                      ? 'text-text-primary bg-bg-elevated border-l-2 border-accent-green'
                      : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated/50 border-l-2 border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Quick Stats */}
          <div className="p-4 border-t border-border mt-4">
            <div className="text-xs text-text-muted uppercase tracking-wide mb-3 px-2">
              Platform Info
            </div>
            <div className="space-y-2 px-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Max Leverage</span>
                <span className="font-mono text-accent-green">25x</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Trading Fee</span>
                <span className="font-mono text-accent-amber">0.1%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Network</span>
                <span className="font-mono text-accent-blue">Polygon</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          <div className="max-w-3xl">

            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-semibold text-text-primary mb-3">
                    System Overview
                  </h1>
                  <p className="text-text-secondary">
                    PolyPerp is a leveraged trading platform for Polymarket prediction markets.
                  </p>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-bg-secondary border border-border rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-accent-green" />
                      <span className="text-text-primary font-medium">Leverage</span>
                    </div>
                    <p className="text-text-muted text-sm">
                      Trade with up to 25x leverage on any prediction market
                    </p>
                  </div>
                  <div className="bg-bg-secondary border border-border rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-accent-blue" />
                      <span className="text-text-primary font-medium">Long/Short</span>
                    </div>
                    <p className="text-text-muted text-sm">
                      Go long (YES) or short (NO) on any market outcome
                    </p>
                  </div>
                  <div className="bg-bg-secondary border border-border rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-accent-amber" />
                      <span className="text-text-primary font-medium">Order Types</span>
                    </div>
                    <p className="text-text-muted text-sm">
                      Market and limit orders with real-time execution
                    </p>
                  </div>
                  <div className="bg-bg-secondary border border-border rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-accent-red" />
                      <span className="text-text-primary font-medium">Risk Management</span>
                    </div>
                    <p className="text-text-muted text-sm">
                      Automatic liquidation engine protects the protocol
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Start Section */}
            {activeSection === 'quickstart' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-semibold text-text-primary mb-3">
                    Quick Start
                  </h1>
                  <p className="text-text-secondary">
                    Get trading in under 2 minutes.
                  </p>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Create Account', desc: 'Sign up with email and password. A wallet is automatically generated for you.', color: 'accent-green' },
                    { step: 2, title: 'Deposit Funds', desc: 'Send USDC to your deposit address on Polygon network. Minimum $10.', color: 'accent-blue' },
                    { step: 3, title: 'Select Market', desc: 'Browse live prediction markets from the header. Click to view charts and order book.', color: 'accent-amber' },
                    { step: 4, title: 'Open Position', desc: 'Choose Long or Short, set size and leverage (1-25x), then execute.', color: 'accent-green' },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4 items-start">
                      <div className={`w-10 h-10 bg-${item.color}/10 text-${item.color} flex items-center justify-center font-semibold rounded-lg shrink-0`}>
                        {item.step}
                      </div>
                      <div className="flex-1 bg-bg-secondary border border-border rounded-lg p-4">
                        <div className={`text-${item.color} font-medium mb-1`}>{item.title}</div>
                        <p className="text-text-muted text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-accent-green/10 border border-accent-green/30 rounded-lg p-4">
                  <p className="text-accent-green text-sm">
                    <strong>Tip:</strong> Start with low leverage (1-5x) while learning. Higher leverage = higher risk.
                  </p>
                </div>
              </div>
            )}

            {/* Trading Section */}
            {activeSection === 'trading' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-semibold text-text-primary mb-3">
                    Trading Mechanics
                  </h1>
                  <p className="text-text-secondary">
                    How perpetual contracts work on prediction markets.
                  </p>
                </div>

                {/* Long vs Short */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bg-bg-secondary border border-accent-green/30 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-accent-green" />
                      <span className="text-accent-green font-semibold">Long (YES)</span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <p className="text-text-muted">Profit when probability <span className="text-accent-green font-medium">increases</span></p>
                      <div className="bg-bg-primary rounded-md p-3 font-mono text-xs">
                        <div className="text-text-muted">Example:</div>
                        <div className="text-text-secondary">Entry: 40% | Exit: 60%</div>
                        <div className="text-text-secondary">Leverage: 10x</div>
                        <div className="text-accent-green font-medium">Profit: +50%</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-bg-secondary border border-accent-red/30 rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingDown className="w-5 h-5 text-accent-red" />
                      <span className="text-accent-red font-semibold">Short (NO)</span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <p className="text-text-muted">Profit when probability <span className="text-accent-red font-medium">decreases</span></p>
                      <div className="bg-bg-primary rounded-md p-3 font-mono text-xs">
                        <div className="text-text-muted">Example:</div>
                        <div className="text-text-secondary">Entry: 60% | Exit: 40%</div>
                        <div className="text-text-secondary">Leverage: 10x</div>
                        <div className="text-accent-green font-medium">Profit: +33%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Types */}
                <div className="bg-bg-secondary border border-border rounded-lg p-5">
                  <div className="text-text-primary font-medium mb-4">Order Types</div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-text-primary text-sm mb-1">Market</div>
                      <p className="text-text-muted text-sm">Execute immediately at best available price</p>
                    </div>
                    <div>
                      <div className="text-text-primary text-sm mb-1">Limit</div>
                      <p className="text-text-muted text-sm">Execute only when price reaches your target</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Leverage Section */}
            {activeSection === 'leverage' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-semibold text-text-primary mb-3">
                    Leverage System
                  </h1>
                  <p className="text-text-secondary">
                    Understanding leverage and liquidation mechanics.
                  </p>
                </div>

                {/* Leverage Options */}
                <div className="bg-bg-secondary border border-border rounded-lg p-5">
                  <div className="text-text-primary font-medium mb-4">Available Leverage</div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 5, 10, 15, 20, 25].map(l => (
                      <div key={l} className={`px-4 py-2 rounded-md text-sm font-mono font-medium ${
                        l <= 5 ? 'bg-accent-green/10 text-accent-green' :
                        l <= 15 ? 'bg-accent-amber/10 text-accent-amber' :
                        'bg-accent-red/10 text-accent-red'
                      }`}>
                        {l}x
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-6 mt-4 text-xs">
                    <span className="text-accent-green">1-5x Low Risk</span>
                    <span className="text-accent-amber">10-15x Medium</span>
                    <span className="text-accent-red">20-25x High Risk</span>
                  </div>
                </div>

                {/* Liquidation Table */}
                <div className="bg-bg-secondary border border-border rounded-lg overflow-hidden">
                  <div className="px-5 py-3 border-b border-border">
                    <span className="text-text-primary font-medium">Liquidation Thresholds</span>
                  </div>
                  <div className="p-5">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-text-muted text-left">
                          <th className="pb-3">Leverage</th>
                          <th className="pb-3">Margin</th>
                          <th className="pb-3">Liquidation Move</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono">
                        {[
                          { lev: '5x', margin: '20%', move: '20%' },
                          { lev: '10x', margin: '10%', move: '10%' },
                          { lev: '15x', margin: '6.7%', move: '6.7%' },
                          { lev: '20x', margin: '5%', move: '5%' },
                          { lev: '25x', margin: '4%', move: '4%' },
                        ].map((row) => (
                          <tr key={row.lev} className="border-t border-border">
                            <td className="py-3 text-accent-blue">{row.lev}</td>
                            <td className="py-3 text-text-secondary">{row.margin}</td>
                            <td className="py-3 text-accent-red">{row.move}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-accent-amber/10 border border-accent-amber/30 rounded-lg p-4 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-accent-amber shrink-0" />
                  <p className="text-accent-amber text-sm">
                    At 25x leverage, a 4% adverse price move will liquidate your entire position. Use appropriate position sizing.
                  </p>
                </div>
              </div>
            )}

            {/* Risk Section */}
            {activeSection === 'risk' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-semibold text-accent-red mb-3">
                    Risk Warning
                  </h1>
                  <p className="text-text-secondary">
                    Important information about trading risks.
                  </p>
                </div>

                <div className="bg-accent-red/10 border border-accent-red/30 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <Shield className="w-8 h-8 text-accent-red shrink-0" />
                    <div className="space-y-4">
                      <p className="text-accent-red font-semibold">
                        Leveraged trading is high risk
                      </p>
                      <ul className="text-text-secondary text-sm space-y-2">
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-accent-red shrink-0 mt-0.5" />
                          You can lose your entire margin if liquidated
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-accent-red shrink-0 mt-0.5" />
                          Only trade with funds you can afford to lose
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-accent-red shrink-0 mt-0.5" />
                          Past performance is not indicative of future results
                        </li>
                        <li className="flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-accent-red shrink-0 mt-0.5" />
                          Prediction markets can be volatile and illiquid
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-bg-secondary border border-border rounded-lg p-5">
                    <div className="text-accent-green font-medium mb-3">Do</div>
                    <ul className="text-text-muted text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="text-accent-green">+</span> Start with low leverage
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent-green">+</span> Use appropriate position sizing
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent-green">+</span> Monitor your positions
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent-green">+</span> Understand liquidation prices
                      </li>
                    </ul>
                  </div>
                  <div className="bg-bg-secondary border border-border rounded-lg p-5">
                    <div className="text-accent-red font-medium mb-3">Don't</div>
                    <ul className="text-text-muted text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <span className="text-accent-red">-</span> Trade with rent money
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent-red">-</span> Use maximum leverage
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent-red">-</span> Ignore liquidation warnings
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-accent-red">-</span> FOMO into positions
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  )
}
