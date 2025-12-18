import { Header } from './components/Header'
import { CodePanel } from './components/CodePanel'
import { VisualizationPanel } from './components/VisualizationPanel'
import { ControlPanel } from './components/ControlPanel'
import { FloatingBall } from './components/FloatingBall'
import { useAlgorithmState } from './hooks/useAlgorithmState'
import { useAutoPlay } from './hooks/useAutoPlay'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import './App.css'

function App() {
  const {
    currentStep,
    currentStepData,
    isPlaying,
    totalSteps,
    goToPrevious,
    goToNext,
    togglePlayPause,
    pause,
    reset,
    goToStep,
  } = useAlgorithmState()

  // 自动播放
  useAutoPlay({
    isPlaying,
    currentStep,
    totalSteps,
    onNext: goToNext,
    onPause: pause,
  })

  // 键盘快捷键
  useKeyboardShortcuts({
    onPrevious: goToPrevious,
    onNext: goToNext,
    onPlayPause: togglePlayPause,
  })

  // 获取当前步骤的数据
  const codeLine = currentStepData?.codeLine ?? 1
  const variables = currentStepData?.variables ?? []
  const l1State = currentStepData?.l1State ?? null
  const l2State = currentStepData?.l2State ?? null
  const resultState = currentStepData?.resultState ?? null
  const pointers = currentStepData?.pointers ?? { l1Position: 0, l2Position: 0, pPosition: 0 }
  const carry = currentStepData?.carry ?? 0
  const description = currentStepData?.description ?? ''

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="left-panel">
          <CodePanel currentLine={codeLine} variables={variables} />
        </div>
        <div className="right-panel">
          <div className="visualization-container">
            <VisualizationPanel
              l1State={l1State}
              l2State={l2State}
              resultState={resultState}
              pointers={pointers}
              carry={carry}
            />
          </div>
          <div className="step-description">
            <span className="description-text">{description}</span>
          </div>
          <ControlPanel
            currentStep={currentStep}
            totalSteps={totalSteps}
            isPlaying={isPlaying}
            onPrevious={goToPrevious}
            onNext={goToNext}
            onPlayPause={togglePlayPause}
            onReset={reset}
            onSeek={goToStep}
          />
        </div>
      </main>
      <FloatingBall />
    </div>
  )
}

export default App
