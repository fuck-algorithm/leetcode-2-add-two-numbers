import { useState, useCallback, useMemo } from 'react'
import { AlgorithmStep } from '../core/types'
import { generateSteps } from '../core/stepGenerator'

interface UseAlgorithmStateOptions {
  initialL1?: number[]
  initialL2?: number[]
}

export function useAlgorithmState(options: UseAlgorithmStateOptions = {}) {
  const { initialL1 = [2, 4, 3], initialL2 = [5, 6, 4] } = options

  const [l1Input, setL1Input] = useState<number[]>(initialL1)
  const [l2Input, setL2Input] = useState<number[]>(initialL2)
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  // 生成算法步骤
  const steps: AlgorithmStep[] = useMemo(() => {
    return generateSteps(l1Input, l2Input)
  }, [l1Input, l2Input])

  // 当前步骤数据
  const currentStepData = steps[currentStep] ?? null

  // 上一步
  const goToPrevious = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1))
  }, [])

  // 下一步
  const goToNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))
  }, [steps.length])

  // 播放/暂停切换
  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  // 暂停
  const pause = useCallback(() => {
    setIsPlaying(false)
  }, [])

  // 重置到第一步
  const reset = useCallback(() => {
    setCurrentStep(0)
    setIsPlaying(false)
  }, [])

  // 跳转到指定步骤
  const goToStep = useCallback(
    (step: number) => {
      setCurrentStep(Math.max(0, Math.min(steps.length - 1, step)))
    },
    [steps.length]
  )

  // 更新输入
  const updateInputs = useCallback((newL1: number[], newL2: number[]) => {
    setL1Input(newL1)
    setL2Input(newL2)
    setCurrentStep(0)
    setIsPlaying(false)
  }, [])

  return {
    // 状态
    currentStep,
    steps,
    currentStepData,
    isPlaying,
    l1Input,
    l2Input,
    totalSteps: steps.length,

    // 操作
    goToPrevious,
    goToNext,
    togglePlayPause,
    pause,
    reset,
    goToStep,
    updateInputs,
  }
}
