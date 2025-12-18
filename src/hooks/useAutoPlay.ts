import { useEffect, useRef } from 'react'

interface UseAutoPlayOptions {
  isPlaying: boolean
  currentStep: number
  totalSteps: number
  onNext: () => void
  onPause: () => void
  interval?: number
}

/**
 * 自动播放 Hook
 * 当 isPlaying 为 true 时，自动按间隔执行下一步
 */
export function useAutoPlay({
  isPlaying,
  currentStep,
  totalSteps,
  onNext,
  onPause,
  interval = 1000,
}: UseAutoPlayOptions) {
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    // 清除之前的定时器
    if (timerRef.current !== null) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    // 如果正在播放且未到最后一步
    if (isPlaying && currentStep < totalSteps - 1) {
      timerRef.current = window.setInterval(() => {
        onNext()
      }, interval)
    }

    // 如果到达最后一步，自动暂停
    if (isPlaying && currentStep >= totalSteps - 1) {
      onPause()
    }

    // 清理函数
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isPlaying, currentStep, totalSteps, onNext, onPause, interval])
}
