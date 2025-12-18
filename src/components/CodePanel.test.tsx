import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import * as fc from 'fast-check'
import { CodePanel } from './CodePanel'
import { VariableState } from '../core/types'
import { CODE_LINES_ARRAY } from '../core/javaCode'

describe('CodePanel Component', () => {
  /**
   * **Feature: leetcode-add-two-numbers-visualizer, Property 3: Step-UI Synchronization**
   * (code panel portion)
   * For any step, verify correct line is highlighted
   * Verify all variables are displayed at correct lines
   * **Validates: Requirements 2.2, 2.3**
   */
  describe('Property 3: Step-UI Synchronization (Code Panel)', () => {
    it('should highlight the correct line for any valid line number', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: CODE_LINES_ARRAY.length }),
          (lineNumber) => {
            const { unmount } = render(<CodePanel currentLine={lineNumber} variables={[]} />)

            const highlightedLine = screen.getByTestId(`code-line-${lineNumber}`)
            expect(highlightedLine).toHaveAttribute('data-highlighted', 'true')
            expect(highlightedLine).toHaveClass('highlighted')

            // 验证其他行没有高亮
            for (let i = 1; i <= CODE_LINES_ARRAY.length; i++) {
              if (i !== lineNumber) {
                const otherLine = screen.getByTestId(`code-line-${i}`)
                expect(otherLine).toHaveAttribute('data-highlighted', 'false')
              }
            }

            unmount()
          }
        ),
        { numRuns: 18 } // 测试所有可能的行号
      )
    })

    it('should display variables at their correct lines', () => {
      const variables: VariableState[] = [
        { name: 'carry', value: '5', line: 4, type: 'number' },
        { name: 'l1', value: 'ListNode(2)', line: 7, type: 'pointer' },
        { name: 'l2', value: 'ListNode(5)', line: 11, type: 'pointer' },
      ]

      render(<CodePanel currentLine={5} variables={variables} />)

      // 验证 carry 变量在第4行显示
      const line4Vars = screen.getByTestId('variables-line-4')
      expect(line4Vars).toHaveTextContent('carry: 5')

      // 验证 l1 变量在第7行显示
      const line7Vars = screen.getByTestId('variables-line-7')
      expect(line7Vars).toHaveTextContent('l1: ListNode(2)')

      // 验证 l2 变量在第11行显示
      const line11Vars = screen.getByTestId('variables-line-11')
      expect(line11Vars).toHaveTextContent('l2: ListNode(5)')
    })

    it('should render all code lines with line numbers', () => {
      render(<CodePanel currentLine={1} variables={[]} />)

      CODE_LINES_ARRAY.forEach((_, index) => {
        const lineNumber = index + 1
        const line = screen.getByTestId(`code-line-${lineNumber}`)
        expect(line).toBeInTheDocument()
        expect(line).toHaveTextContent(lineNumber.toString())
      })
    })

    it('should apply correct CSS class based on variable type', () => {
      const variables: VariableState[] = [
        { name: 'carry', value: '0', line: 4, type: 'number' },
        { name: 'p', value: 'ListNode(0)', line: 3, type: 'pointer' },
        { name: 'newHead', value: 'ListNode(0)', line: 2, type: 'node' },
      ]

      render(<CodePanel currentLine={1} variables={variables} />)

      const line4Vars = screen.getByTestId('variables-line-4')
      const numberBadge = line4Vars.querySelector('.variable-badge.number')
      expect(numberBadge).toBeInTheDocument()

      const line3Vars = screen.getByTestId('variables-line-3')
      const pointerBadge = line3Vars.querySelector('.variable-badge.pointer')
      expect(pointerBadge).toBeInTheDocument()

      const line2Vars = screen.getByTestId('variables-line-2')
      const nodeBadge = line2Vars.querySelector('.variable-badge.node')
      expect(nodeBadge).toBeInTheDocument()
    })
  })
})
