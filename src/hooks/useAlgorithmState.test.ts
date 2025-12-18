import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import * as fc from 'fast-check'
import { useAlgorithmState } from './useAlgorithmState'

describe('useAlgorithmState Hook', () => {
  /**
   * **Feature: leetcode-add-two-numbers-visualizer, Property 3: Step-UI Synchronization**
   * For any step, verify all UI components reflect same step state
   * **Validates: Requirements 5.3**
   */
  describe('Property 3: Step-UI Synchronization', () => {
    it('should provide consistent step data for any valid step index', () => {
      const { result } = renderHook(() => useAlgorithmState())

      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: result.current.totalSteps - 1 }),
          (stepIndex) => {
            act(() => {
              result.current.goToStep(stepIndex)
            })

            // 验证当前步骤索引正确
            expect(result.current.currentStep).toBe(stepIndex)

            // 验证步骤数据存在且完整
            const stepData = result.current.currentStepData
            expect(stepData).not.toBeNull()
            expect(stepData?.stepNumber).toBe(stepIndex)
            expect(typeof stepData?.codeLine).toBe('number')
            expect(Array.isArray(stepData?.variables)).toBe(true)
            expect(stepData?.pointers).toBeDefined()
          }
        ),
        { numRuns: 50 }
      )
    })

    it('should clamp step index to valid range', () => {
      const { result } = renderHook(() => useAlgorithmState())
      const totalSteps = result.current.totalSteps

      // 尝试跳转到负数步骤
      act(() => {
        result.current.goToStep(-5)
      })
      expect(result.current.currentStep).toBe(0)

      // 尝试跳转到超出范围的步骤
      act(() => {
        result.current.goToStep(totalSteps + 10)
      })
      expect(result.current.currentStep).toBe(totalSteps - 1)
    })
  })

  /**
   * **Feature: leetcode-add-two-numbers-visualizer, Property 7: Input Change Regeneration**
   * For any input change, verify steps are regenerated correctly
   * **Validates: Requirements 5.5**
   */
  describe('Property 7: Input Change Regeneration', () => {
    it('should regenerate steps when inputs change', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 1, maxLength: 5 }),
          fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 1, maxLength: 5 }),
          (l1, l2) => {
            const { result } = renderHook(() => useAlgorithmState())

            // 更新输入
            act(() => {
              result.current.updateInputs(l1, l2)
            })

            // 验证步骤已重新生成
            expect(result.current.steps.length).toBeGreaterThan(0)
            expect(result.current.currentStep).toBe(0)
            expect(result.current.isPlaying).toBe(false)

            // 验证输入已更新
            expect(result.current.l1Input).toEqual(l1)
            expect(result.current.l2Input).toEqual(l2)
          }
        ),
        { numRuns: 30 }
      )
    })

    it('should reset to first step when inputs change', () => {
      const { result } = renderHook(() => useAlgorithmState())

      // 先前进几步
      act(() => {
        result.current.goToNext()
        result.current.goToNext()
      })
      expect(result.current.currentStep).toBe(2)

      // 更新输入
      act(() => {
        result.current.updateInputs([1, 2], [3, 4])
      })

      // 验证重置到第一步
      expect(result.current.currentStep).toBe(0)
    })
  })

  describe('Navigation', () => {
    it('should navigate to previous step', () => {
      const { result } = renderHook(() => useAlgorithmState())

      // 先前进一步
      act(() => {
        result.current.goToNext()
      })
      expect(result.current.currentStep).toBe(1)

      // 返回上一步
      act(() => {
        result.current.goToPrevious()
      })
      expect(result.current.currentStep).toBe(0)
    })

    it('should not go below step 0', () => {
      const { result } = renderHook(() => useAlgorithmState())

      act(() => {
        result.current.goToPrevious()
      })
      expect(result.current.currentStep).toBe(0)
    })

    it('should not exceed max steps', () => {
      const { result } = renderHook(() => useAlgorithmState())
      const maxStep = result.current.totalSteps - 1

      // 跳转到最后一步
      act(() => {
        result.current.goToStep(maxStep)
      })

      // 尝试继续前进
      act(() => {
        result.current.goToNext()
      })
      expect(result.current.currentStep).toBe(maxStep)
    })
  })

  describe('Play/Pause', () => {
    it('should toggle play state', () => {
      const { result } = renderHook(() => useAlgorithmState())

      expect(result.current.isPlaying).toBe(false)

      act(() => {
        result.current.togglePlayPause()
      })
      expect(result.current.isPlaying).toBe(true)

      act(() => {
        result.current.togglePlayPause()
      })
      expect(result.current.isPlaying).toBe(false)
    })

    it('should pause when pause is called', () => {
      const { result } = renderHook(() => useAlgorithmState())

      act(() => {
        result.current.togglePlayPause()
      })
      expect(result.current.isPlaying).toBe(true)

      act(() => {
        result.current.pause()
      })
      expect(result.current.isPlaying).toBe(false)
    })
  })
})
