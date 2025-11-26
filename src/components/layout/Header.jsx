import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, User, Menu, X, Plus, Key, Eye, EyeOff, Copy, AlertTriangle, ChevronDown, TrendingUp } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { AuthModal } from '../auth/AuthModal'
import { Modal } from '../ui/Modal'
import { useToast } from '../../context/ToastContext'

export function Header() {
  const { user, isAuthenticated, logout, exportPrivateKey } = useAuth()
  const toast = useToast()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportPassword, setExportPassword] = useState('')
  const [revealedKey, setRevealedKey] = useState('')
  const [showKey, setShowKey] = useState(false)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showUserMenu && !e.target.closest('.user-menu-container')) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showUserMenu])

  const handleExportKey = async () => {
    try {
      const privateKey = await exportPrivateKey(exportPassword)
      setRevealedKey(privateKey)
    } catch (err) {
      toast.error(err.message || 'Failed to export private key')
    }
  }

  const handleCopyKey = () => {
    navigator.clipboard.writeText(revealedKey)
    toast.success('Private key copied to clipboard')
  }

  const closeExportModal = () => {
    setShowExportModal(false)
    setExportPassword('')
    setRevealedKey('')
    setShowKey(false)
  }

  return (
    <>
      <header className="bg-bg-secondary border-b border-border sticky top-0 z-40">
        <div className="px-4 h-14 flex items-center justify-between">
          {/* Left side: Logo + Nav + Markets */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent-green" />
              <span className="text-lg font-semibold text-text-primary">
                PolyPerp
              </span>
            </Link>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-1 ml-4">
              <Link
                to="/"
                className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-md transition-colors"
              >
                Trade
              </Link>
              <Link
                to="/docs"
                className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-md transition-colors"
              >
                Docs
              </Link>
              <a
                href="https://x.com/PolynomialSol"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-md transition-colors"
              >
                Twitter
              </a>
            </nav>

          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-text-secondary">
              <div className="status-online" />
              <span>Live</span>
            </div>

            {isAuthenticated ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-bg-elevated hover:bg-border/50 border border-border rounded-lg transition-colors"
                >
                  {user.balance > 0 ? (
                    <span className="text-sm font-mono font-medium text-accent-green">
                      ${user.balance?.toLocaleString()}
                    </span>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowDepositModal(true); setShowUserMenu(false) }}
                      className="flex items-center gap-1 text-sm text-accent-amber hover:text-accent-amber/80"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Deposit
                    </button>
                  )}
                  <div className="w-px h-4 bg-border" />
                  <span className="text-sm text-text-secondary max-w-[80px] truncate">
                    {user.email || user.walletAddress?.slice(0, 6)}
                  </span>
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                </button>

                {/* Dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-bg-secondary border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-xs text-text-muted uppercase tracking-wide">Account</p>
                      <p className="text-sm text-text-primary truncate mt-1">
                        {user.email || user.walletAddress?.slice(0, 20)}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => { setShowDepositModal(true); setShowUserMenu(false) }}
                        className="w-full px-4 py-2.5 text-left text-sm text-accent-green hover:bg-bg-elevated transition-colors flex items-center gap-3"
                      >
                        <Plus className="w-4 h-4" />
                        Deposit Funds
                      </button>
                      <button
                        onClick={() => { setShowExportModal(true); setShowUserMenu(false) }}
                        className="w-full px-4 py-2.5 text-left text-sm text-accent-amber hover:bg-bg-elevated transition-colors flex items-center gap-3"
                      >
                        <Key className="w-4 h-4" />
                        Export Private Key
                      </button>
                    </div>
                    <div className="border-t border-border py-1">
                      <button
                        onClick={() => {
                          logout()
                          setShowUserMenu(false)
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-accent-red hover:bg-bg-elevated transition-colors flex items-center gap-3"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-accent-green hover:bg-accent-green-hover text-white text-sm font-medium rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                Connect
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-bg-elevated rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-text-primary" />
              ) : (
                <Menu className="w-5 h-5 text-text-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden px-4 pb-4 border-t border-border pt-3 flex flex-col gap-1">
            <Link
              to="/"
              className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trade
            </Link>
            <Link
              to="/docs"
              className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </Link>
            <a
              href="https://x.com/PolynomialSol"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-md"
            >
              Twitter
            </a>
          </nav>
        )}
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      {/* Deposit Modal */}
      <Modal isOpen={showDepositModal} onClose={() => setShowDepositModal(false)} title="Deposit Funds" size="md">
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            Send USDC to your deposit address to start trading.
          </p>

          <div className="bg-bg-elevated border border-border rounded-lg p-4">
            <p className="text-xs text-text-muted uppercase tracking-wide mb-2">Deposit Address (Polygon)</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm font-mono text-accent-green bg-bg-primary px-3 py-2 rounded-md break-all">
                {user?.walletAddress || '0x...'}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(user?.walletAddress || '')
                  toast.success('Address copied')
                }}
                className="px-3 py-2 bg-bg-primary hover:bg-border text-sm text-text-primary rounded-md transition-colors flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </button>
            </div>
          </div>

          <div className="bg-accent-amber/10 border border-accent-amber/30 rounded-lg p-4 text-sm text-accent-amber">
            <strong>Note:</strong> Only send USDC on Polygon network.
          </div>

          <p className="text-center text-xs text-text-muted">
            Minimum deposit: $10 USDC
          </p>
        </div>
      </Modal>

      {/* Export Private Key Modal */}
      <Modal isOpen={showExportModal} onClose={closeExportModal} title="Export Private Key" size="md">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-accent-red/10 border border-accent-red/30 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-accent-red flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-accent-red font-medium mb-1">Warning: Sensitive Data</p>
              <p className="text-text-secondary">
                Never share your private key. Anyone with access has full control of your funds.
              </p>
            </div>
          </div>

          {!revealedKey ? (
            <>
              {user?.email && (
                <div>
                  <label className="block text-xs text-text-muted uppercase tracking-wide mb-2">
                    Enter password to decrypt
                  </label>
                  <input
                    type="password"
                    value={exportPassword}
                    onChange={(e) => setExportPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-bg-primary border border-border rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted"
                  />
                </div>
              )}
              <button
                onClick={handleExportKey}
                className="w-full px-4 py-3 bg-accent-amber hover:bg-accent-amber/90 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Reveal Private Key
              </button>
            </>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-text-muted uppercase tracking-wide mb-2">
                  Private Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={revealedKey}
                    readOnly
                    className="w-full bg-bg-primary border border-border rounded-lg px-4 py-3 pr-20 text-sm font-mono text-accent-green"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="p-2 hover:bg-bg-elevated rounded-md transition-colors"
                    >
                      {showKey ? (
                        <EyeOff className="w-4 h-4 text-text-muted" />
                      ) : (
                        <Eye className="w-4 h-4 text-text-muted" />
                      )}
                    </button>
                    <button
                      onClick={handleCopyKey}
                      className="p-2 hover:bg-bg-elevated rounded-md transition-colors"
                    >
                      <Copy className="w-4 h-4 text-text-muted" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-text-muted">
                Import this key into MetaMask or any EVM wallet to access your funds on Polygon.
              </p>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}
