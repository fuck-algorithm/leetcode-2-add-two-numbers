import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { generateSteps } from './stepGenerator'
import { AlgorithmStep } from './types'

describe('Step Generator', () => {
  /**
   * **Feature: leetcode-add-two-numbers-visualizer, Property 4: Step Generation Completeness**
   * For any valid input arrays, verify all steps contain required fields
   * Verify step sequence captures all state changes
   * **Validates: Requirements 5.1, 5.2**
   */
  describe('Property 4: Step Generation Completeness', () => {
    it('should generate steps with all required fields for any valid input', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 1, maxLength: 10 }),
          fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 1, maxLength: 10 }),
          (l1Arr, l2Arr) => {
            const steps = generateSteps(l1Arr, l2Arr)

            // 验证步骤数组不为空
            expect(steps.length).toBeGreaterThan(0)

            // 验证每个步骤都包含所有必需字段
            steps.forEach((step: AlgorithmStep, index: number) => {
              expect(step.stepNumber).toBe(index)
              expect(typeof step.codeLine).toBe('number')
              expect(step.codeLine).toBeGreaterThan(0)
              expect(typeof step.description).toBe('string')
              expect(step.description.length).toBeGreaterThan(0)
              expect(Array.isArray(step.variables)).toBe(true)
              expect(typeof step.carry).toBe('number')
              expect(step.carry).toBeGreaterThanOrEqual(0)
              expect(step.pointers).toBeDefined()
              expect(typeof step.pointers.l1Position).toBe('number')
              expect(typeof step.pointers.l2Position).toBe('number')
              expect(typeof step.pointers.pPosition).toBe('number')
            })
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should have sequential step numbers', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 1, maxLength: 5 }),
          fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 1, maxLength: 5 }),
          (l1Arr, l2Arr) => {
            const steps = generateSteps(l1Arr, l2Arr)

            for (let i = 0; i < steps.length; i++) {
              expect(steps[i]?.stepNumber).toBe(i)
            }
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should produce correct result for example input [2,4,3] + [5,6,4]', () => {
      const steps = generateSteps([2, 4, 3], [5, 6, 4])

      // 验证最后一步的结果
      const lastStep = steps[steps.length - 1]
      expect(lastStep?.resultState?.values).toEqual([7, 0, 8])
    })

    it('should handle carry propagation correctly', () => {
      // [9,9,9,9,9,9,9] + [9,9,9,9] = [8,9,9,9,0,0,0,1]
      const steps = generateSteps([9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9])

      const lastStep = steps[steps.length - 1]
      expect(lastStep?.resultState?.values).toEqual([8, 9, 9, 9, 0, 0, 0, 1])
    })

    it('should handle single digit inputs', () => {
      const steps = generateSteps([0], [0])

      const lastStep = steps[steps.length - 1]
      expect(lastStep?.resultState?.values).toEqual([0])
    })

    it('should track variables correctly', () => {
      const steps = generateSteps([2, 4, 3], [5, 6, 4])

      // 每个步骤都应该有变量状态
      steps.forEach((step) => {
        expect(step.variables.length).toBeGreaterThan(0)

        // 检查必需的变量名
        const varNames = step.variables.map((v) => v.name)
        expect(varNames).toContain('l1')
        expect(varNames).toContain('l2')
        expect(varNames).toContain('carry')
        expect(varNames).toContain('p')
        expect(varNames).toContain('newHead')
      })
    })
  })
})
