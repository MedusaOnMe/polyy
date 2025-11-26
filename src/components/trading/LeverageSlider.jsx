import { LEVERAGE_OPTIONS } from '../../utils/constants'

export function LeverageSlider({ value, onChange }) {
  const handleSliderChange = (e) => {
    const sliderValue = parseInt(e.target.value)
    // Map slider position to leverage value
    const index = Math.round((sliderValue / 100) * (LEVERAGE_OPTIONS.length - 1))
    onChange(LEVERAGE_OPTIONS[index])
  }

  // Find current index
  const currentIndex = LEVERAGE_OPTIONS.indexOf(value)
  const sliderValue = (currentIndex / (LEVERAGE_OPTIONS.length - 1)) * 100

  // Determine color based on leverage level
  const getLeverageColor = (lev) => {
    if (lev <= 5) return 'text-accent-green'
    if (lev <= 15) return 'text-accent-amber'
    return 'text-accent-red'
  }

  const getSliderColor = () => {
    if (value <= 5) return '#22c55e'
    if (value <= 15) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs text-text-muted uppercase tracking-wide">Leverage</label>
        <span className={`text-sm font-mono font-semibold ${getLeverageColor(value)}`}>{value}x</span>
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={handleSliderChange}
          className="w-full h-1.5 appearance-none cursor-pointer rounded-full"
          style={{
            background: `linear-gradient(to right, ${getSliderColor()} 0%, ${getSliderColor()} ${sliderValue}%, #21262d ${sliderValue}%, #21262d 100%)`,
          }}
        />

        {/* Tick marks */}
        <div className="flex justify-between mt-2 px-0.5">
          {LEVERAGE_OPTIONS.filter((_, i) => i % 2 === 0 || i === LEVERAGE_OPTIONS.length - 1).map((lev) => (
            <button
              key={lev}
              onClick={() => onChange(lev)}
              className={`text-xs transition-colors ${
                value === lev ? getLeverageColor(lev) + ' font-medium' : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {lev}x
            </button>
          ))}
        </div>
      </div>

      {/* Quick select buttons */}
      <div className="flex gap-1.5 mt-3">
        {[1, 5, 10, 15, 20, 25].map((lev) => (
          <button
            key={lev}
            onClick={() => onChange(lev)}
            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
              value === lev
                ? `${getLeverageColor(lev)} bg-bg-elevated border border-current`
                : 'bg-bg-primary text-text-muted hover:text-text-secondary border border-border hover:border-border-light'
            }`}
          >
            {lev}x
          </button>
        ))}
      </div>
    </div>
  )
}
