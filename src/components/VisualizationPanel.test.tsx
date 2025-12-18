import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import * as fc from 'fast-check'
import { VisualizationPanel } from './VisualizationPanel'
import { ListNodeState, PointerState } from '../core/types'

// Mock ResizeObserver
beforeEach(() => {
  ;(globalThis as typeof globalThis & { ResizeObserver: typeof ResizeObserver }).ResizeObserver =
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
})

describe('VisualizationPanel Component', () => {
  const defaultPointers: PointerState = {
    l1Position: 0,
    l2Position: 0,
    pPosition: 0,
  }

  /**
   * **Feature: leetcode-add-two-numbers-visualizer, Property 5: Node Rendering Consistency**
   * For any linked list, verify each node displays value and arrow
   * **Validates: Requirements 4.3**
   */
  describe('Property 5: Node Rendering Consistency', () => {
    it('should render each node with value for any valid linked list', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 1, maxLength: 5 }),
          (values) => {
            const l1State: ListNodeState = { values, currentIndex: 0 }

            const { unmount } = render(
              <VisualizationPanel
                l1State={l1State}
                l2State={null}
                resultState={null}
                pointers={defaultPointers}
                carry={0}
              />
            )

            // 验证每个节点都有值显示
            values.forEach((value, index) => {
              const nodeValue = screen.getByTestId(`node-value-l1-${index}`)
              expect(nodeValue).toHaveTextContent(value.toString())
            })

            unmount()
          }
        ),
        { numRuns: 50 }
      )
    })

    it('should render arrows between nodes', () => {
      const l1State: ListNodeState = { values: [2, 4, 3], currentIndex: 0 }

      render(
        <VisualizationPanel
          l1State={l1State}
          l2State={null}
          resultState={null}
          pointers={defaultPointers}
          carry={0}
        />
      )

      // 验证箭头存在
      const arrows = screen.getAllByTestId('arrow')
      expect(arrows.length).toBeGreaterThan(0)
    })

    it('should render null indicator at end of list', () => {
      const l1State: ListNodeState = { values: [2], currentIndex: 0 }

      render(
        <VisualizationPanel
          l1State={l1State}
          l2State={null}
          resultState={null}
          pointers={defaultPointers}
          carry={0}
        />
      )

      const nullIndicator = screen.getByTestId('null-indicator')
      expect(nullIndicator).toBeInTheDocument()
    })

    it('should render labels for all linked lists', () => {
      const l1State: ListNodeState = { values: [2, 4, 3], currentIndex: 0 }
      const l2State: ListNodeState = { values: [5, 6, 4], currentIndex: 0 }
      const resultState: ListNodeState = { values: [7], currentIndex: 0 }

      render(
        <VisualizationPanel
          l1State={l1State}
          l2State={l2State}
          resultState={resultState}
          pointers={defaultPointers}
          carry={0}
        />
      )

      expect(screen.getByTestId('label-l1')).toBeInTheDocument()
      expect(screen.getByTestId('label-l2')).toBeInTheDocument()
      expect(screen.getByTestId('label-结果')).toBeInTheDocument()
    })
  })

  /**
   * **Feature: leetcode-add-two-numbers-visualizer, Property 6: Carry Display Correctness**
   * For any step with carry > 0, verify carry is displayed
   * **Validates: Requirements 4.5**
   */
  describe('Property 6: Carry Display Correctness', () => {
    it('should display carry when carry > 0', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 9 }), (carry) => {
          const { unmount } = render(
            <VisualizationPanel
              l1State={{ values: [1], currentIndex: 0 }}
              l2State={null}
              resultState={null}
              pointers={defaultPointers}
              carry={carry}
            />
          )

          const carryDisplay = screen.getByTestId('carry-display')
          expect(carryDisplay).toHaveTextContent(carry.toString())

          unmount()
        }),
        { numRuns: 9 }
      )
    })

    it('should display carry value as 0 when carry is 0', () => {
      render(
        <VisualizationPanel
          l1State={{ values: [1], currentIndex: 0 }}
          l2State={null}
          resultState={null}
          pointers={defaultPointers}
          carry={0}
        />
      )

      const carryDisplay = screen.getByTestId('carry-display')
      expect(carryDisplay).toHaveTextContent('0')
    })
  })
})
