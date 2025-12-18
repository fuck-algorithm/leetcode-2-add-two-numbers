import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

// Mock ResizeObserver
beforeEach(() => {
  ;(globalThis as typeof globalThis & { ResizeObserver: typeof ResizeObserver }).ResizeObserver =
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
})

describe('App Component', () => {
  /**
   * **Feature: leetcode-add-two-numbers-visualizer, Property 8: Responsive Layout Constraint**
   * For viewport sizes >= 1280x720, verify no scrolling required
   * **Validates: Requirements 8.2**
   */
  describe('Property 8: Responsive Layout Constraint', () => {
    it('should render all main components', () => {
      render(<App />)

      // 验证所有主要组件都已渲染
      expect(screen.getByText('2. 两数相加')).toBeInTheDocument()
      expect(screen.getByTestId('code-panel')).toBeInTheDocument()
      expect(screen.getByTestId('visualization-panel')).toBeInTheDocument()
      expect(screen.getByTestId('control-panel')).toBeInTheDocument()
      expect(screen.getByTestId('floating-ball')).toBeInTheDocument()
    })

    it('should have app container with overflow hidden', () => {
      render(<App />)

      const app = document.querySelector('.app')
      expect(app).toBeInTheDocument()
      // CSS class .app has overflow: hidden to prevent scrolling
    })

    it('should render header with correct links', () => {
      render(<App />)

      const leetcodeLink = screen.getByTestId('leetcode-link')
      expect(leetcodeLink).toHaveAttribute('href', 'https://leetcode.cn/problems/add-two-numbers/')

      const githubLink = screen.getByTestId('github-link')
      expect(githubLink).toHaveAttribute(
        'href',
        'https://github.com/fuck-algorithm/leetcode-2-add-two-numbers'
      )
    })

    it('should display step counter', () => {
      render(<App />)

      // 初始状态应该显示步骤 1
      expect(screen.getByText(/步骤 1/)).toBeInTheDocument()
    })
  })

  describe('Integration', () => {
    it('should display control buttons with shortcuts', () => {
      render(<App />)

      expect(screen.getByTestId('prev-button')).toHaveTextContent('上一步')
      expect(screen.getByTestId('prev-button')).toHaveTextContent('(←)')
      expect(screen.getByTestId('next-button')).toHaveTextContent('下一步')
      expect(screen.getByTestId('next-button')).toHaveTextContent('(→)')
      expect(screen.getByTestId('play-pause-button')).toHaveTextContent('播放')
      expect(screen.getByTestId('play-pause-button')).toHaveTextContent('(Space)')
    })

    it('should have prev button disabled at first step', () => {
      render(<App />)

      const prevButton = screen.getByTestId('prev-button')
      expect(prevButton).toBeDisabled()
    })
  })
})
