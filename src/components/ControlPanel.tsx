import './ControlPanel.css'

interface ControlPanelProps {
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  onPrevious: () => void
  onNext: () => void
  onPlayPause: () => void
  onReset: () => void
  onSeek: (step: number) => void
}

export function ControlPanel({
  currentStep,
  totalSteps,
  isPlaying,
  onPrevious,
  onNext,
  onPlayPause,
  onReset,
  onSeek,
}: ControlPanelProps) {
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep >= totalSteps - 1
  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    onSeek(value)
  }

  return (
    <div className="control-panel" data-testid="control-panel">
      <div className="step-info">
        <span className="step-counter">
          步骤 {currentStep + 1} / {totalSteps}
        </span>
      </div>
      <div className="control-buttons">
        <button
          className="control-button reset-button"
          onClick={onReset}
          data-testid="reset-button"
          aria-label="重置"
        >
          <span className="button-icon">⟲</span>
          <span className="button-text">重置</span>
        </button>

        <button
          className="control-button"
          onClick={onPrevious}
          disabled={isFirstStep}
          data-testid="prev-button"
          aria-label="上一步"
        >
          <span className="button-icon">◀</span>
          <span className="button-text">上一步</span>
          <span className="shortcut-hint">(←)</span>
        </button>

        <button
          className="control-button play-button"
          onClick={onPlayPause}
          data-testid="play-pause-button"
          aria-label={isPlaying ? '暂停' : '播放'}
        >
          <span className="button-icon">{isPlaying ? '⏸' : '▶'}</span>
          <span className="button-text">{isPlaying ? '暂停' : '播放'}</span>
          <span className="shortcut-hint">(Space)</span>
        </button>

        <button
          className="control-button"
          onClick={onNext}
          disabled={isLastStep}
          data-testid="next-button"
          aria-label="下一步"
        >
          <span className="button-text">下一步</span>
          <span className="button-icon">▶</span>
          <span className="shortcut-hint">(→)</span>
        </button>
      </div>

      <div className="progress-container">
        <input
          type="range"
          className="progress-slider"
          min={0}
          max={totalSteps - 1}
          value={currentStep}
          onChange={handleProgressChange}
          data-testid="progress-slider"
          style={{
            background: `linear-gradient(to right, #4ade80 0%, #4ade80 ${progress}%, #4b5563 ${progress}%, #4b5563 100%)`
          }}
        />
      </div>
    </div>
  )
}
