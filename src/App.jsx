import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { MarketProvider } from './context/MarketContext'
import { PositionProvider } from './context/PositionContext'
import { ToastProvider } from './context/ToastContext'
import { Header } from './components/layout/Header'
import { Ticker } from './components/layout/Ticker'
import { TradingChart } from './components/trading/TradingChart'
import { OrderBook } from './components/trading/OrderBook'
import { OrderEntry } from './components/trading/OrderEntry'
import { MarketStats } from './components/trading/MarketStats'
import { PositionsPanel } from './components/positions/PositionsPanel'
import { AIAnalysis } from './components/trading/AIAnalysis'
import { ToastContainer } from './components/ui/Toast'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { Docs } from './pages/Docs'

function TradingPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <Ticker />

      {/* Main content */}
      <main className="h-[calc(100vh-56px-37px)] overflow-auto">
        <div className="p-3 lg:p-4">
          {/* Main layout: Left section + Order Entry */}
          <div className="flex flex-col xl:flex-row gap-3 lg:gap-4">

            {/* Left Section: Order Book + Chart + Stats + Positions */}
            <div className="flex-1 flex flex-col gap-3 lg:gap-4 min-w-0">
              {/* Top row: Order Book + Chart */}
              <div className="flex flex-col xl:flex-row gap-3 lg:gap-4">
                {/* Order Book - left of chart on desktop */}
                <div className="hidden xl:block xl:w-[280px]">
                  <div className="h-[600px]">
                    <OrderBook />
                  </div>
                </div>

                {/* Chart */}
                <div className="flex-1 h-[500px] lg:h-[600px]">
                  <TradingChart />
                </div>
              </div>

              {/* Market Stats - spans full width */}
              <MarketStats />

              {/* Positions Panel - spans full width */}
              <PositionsPanel />

              {/* AI Analysis - spans full width */}
              <AIAnalysis />
            </div>

            {/* Right Column: Order Entry */}
            <div className="xl:w-[320px] flex flex-col gap-3 lg:gap-4">
              <OrderEntry />

              {/* Order Book - shown on mobile/tablet only */}
              <div className="xl:hidden min-h-[350px]">
                <OrderBook />
              </div>
            </div>
          </div>
        </div>
      </main>

      <ToastContainer />
    </div>
  )
}

function App() {
  const [loading, setLoading] = useState(true)
  const [showApp, setShowApp] = useState(false)

  const handleLoadingComplete = () => {
    setLoading(false)
    setTimeout(() => setShowApp(true), 100)
  }

  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <MarketProvider>
            <PositionProvider>
              {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
              {showApp && (
                <Routes>
                  <Route path="/" element={<TradingPage />} />
                  <Route path="/docs" element={<Docs />} />
                </Routes>
              )}
            </PositionProvider>
          </MarketProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
