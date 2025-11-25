import { useState, useEffect } from 'react'

export function LoadingScreen({ onComplete }) {
  const [lines, setLines] = useState([])
  const [complete, setComplete] = useState(false)

  const loadingSequence = [
    { text: '> POLYNOMIAL v1.0', delay: 200 },
    { text: '> Initializing system...', delay: 400 },
    { text: '> Connecting to Polymarket API...', delay: 600 },
    { text: '> Loading leverage markets...', delay: 500 },
    { text: '> Fetching order book data...', delay: 400 },
    { text: '> Syncing price feeds...', delay: 300 },
    { text: '> Calibrating risk engine...', delay: 350 },
    { text: '> [OK] All systems operational', delay: 500 },
    { text: '> Launching terminal...', delay: 400 },
  ]

  useEffect(() => {
    let totalDelay = 0

    loadingSequence.forEach((item, index) => {
      totalDelay += item.delay
      setTimeout(() => {
        setLines(prev => [...prev, item.text])
      }, totalDelay)
    })

    // Complete after all lines
    totalDelay += 600
    setTimeout(() => {
      setComplete(true)
      setTimeout(onComplete, 300)
    }, totalDelay)
  }, [])

  return (
    <div className="fixed inset-0 bg-term-black z-50 flex items-center justify-center">
      <div className="crt-overlay" />

      <div className="w-full max-w-lg p-8">
        {/* ASCII Art Logo */}
        <pre className="text-term-green text-[10px] leading-tight mb-8 text-center font-mono">
{`
 ██████╗  ██████╗ ██╗  ██╗   ██╗
 ██╔══██╗██╔═══██╗██║  ╚██╗ ██╔╝
 ██████╔╝██║   ██║██║   ╚████╔╝
 ██╔═══╝ ██║   ██║██║    ╚██╔╝
 ██║     ╚██████╔╝███████╗██║
 ╚═╝      ╚═════╝ ╚══════╝╚═╝
`}
        </pre>

        {/* Terminal output */}
        <div className="bg-term-dark border border-term-border p-4 font-mono min-h-[280px]">
          <div className="space-y-1">
            {lines.map((line, i) => (
              <div
                key={i}
                className={`text-xs ${
                  line.includes('[OK]') ? 'text-term-green' :
                  line.includes('POLYNOMIAL') ? 'text-term-green term-glow font-bold' :
                  'text-term-text-dim'
                }`}
              >
                {line}
              </div>
            ))}
            {!complete && (
              <div className="text-term-green text-xs">
                <span className="cursor-blink"></span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1 bg-term-border overflow-hidden">
          <div
            className="h-full bg-term-green transition-all duration-300 ease-out"
            style={{
              width: `${(lines.length / loadingSequence.length) * 100}%`,
              boxShadow: '0 0 10px #00ff41'
            }}
          />
        </div>

        <p className="text-center text-[10px] text-term-text-dim mt-4 uppercase tracking-widest">
          Leveraged Prediction Market Trading
        </p>
      </div>
    </div>
  )
}
