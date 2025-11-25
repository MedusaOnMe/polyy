import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { MarketProvider } from './context/MarketContext'
import { PositionProvider } from './context/PositionContext'
import { ToastProvider } from './context/ToastContext'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { TradingChart } from './components/trading/TradingChart'
import { OrderBook } from './components/trading/OrderBook'
import { OrderEntry } from './components/trading/OrderEntry'
import { MarketStats } from './components/trading/MarketStats'
import { PositionsPanel } from './components/positions/PositionsPanel'
import { ToastContainer } from './components/ui/Toast'
import { Docs } from './pages/Docs'

function TradingPage() {
  return (
    <div className="min-h-screen bg-primary">
      <Header />

      <div className="flex h-[calc(100vh-105px)]">
        {/* Sidebar - Markets list */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 space-y-4">
            {/* Top row: Chart + Order Book + Order Entry */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              {/* Chart - takes most space */}
              <div className="xl:col-span-7 h-[520px]">
                <TradingChart />
              </div>

              {/* Order Book */}
              <div className="xl:col-span-2 min-h-[400px]">
                <OrderBook />
              </div>

              {/* Order Entry */}
              <div className="xl:col-span-3 min-h-[400px]">
                <OrderEntry />
              </div>
            </div>

            {/* Market Stats */}
            <MarketStats />

            {/* Positions Panel */}
            <PositionsPanel />
          </div>
        </main>
      </div>

      <ToastContainer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <MarketProvider>
            <PositionProvider>
              <Routes>
                <Route path="/" element={<TradingPage />} />
                <Route path="/docs" element={<Docs />} />
              </Routes>
            </PositionProvider>
          </MarketProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
