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

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs text-text-secondary">Leverage</label>
        <span className="text-sm font-bold text-accent-blue">{value}x</span>
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={handleSliderChange}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #58a6ff 0%, #58a6ff ${sliderValue}%, #30363d ${sliderValue}%, #30363d 100%)`,
          }}
        />

        {/* Tick marks */}
        <div className="flex justify-between mt-1 px-1">
          {LEVERAGE_OPTIONS.filter((_, i) => i % 2 === 0 || i === LEVERAGE_OPTIONS.length - 1).map((lev) => (
            <button
              key={lev}
              onClick={() => onChange(lev)}
              className={`text-[10px] transition-colors ${
                value === lev ? 'text-accent-blue font-medium' : 'text-text-secondary hover:text-text-primary'
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
            className={`flex-1 py-1.5 text-xs font-medium rounded transition-colors ${
              value === lev
                ? 'bg-accent-blue text-white'
                : 'bg-tertiary text-text-secondary hover:text-text-primary hover:bg-border'
            }`}
          >
            {lev}x
          </button>
        ))}
      </div>
    </div>
  )
}
