import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from './Header'

describe('Header Component', () => {
  /**
   * Unit tests for Header component
   * **Validates: Requirements 1.1, 1.2, 1.3, 1.4**
   */

  it('should render the title "2. 两数相加"', () => {
    render(<Header />)
    const title = screen.getByText('2. 两数相加')
    expect(title).toBeInTheDocument()
  })

  it('should have LeetCode link with correct href', () => {
    render(<Header />)
    const link = screen.getByTestId('leetcode-link')
    expect(link).toHaveAttribute('href', 'https://leetcode.cn/problems/add-two-numbers/')
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('should have GitHub link with correct href', () => {
    render(<Header />)
    const link = screen.getByTestId('github-link')
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/fuck-algorithm/leetcode-2-add-two-numbers'
    )
    expect(link).toHaveAttribute('target', '_blank')
  })

  it('should render GitHub icon', () => {
    render(<Header />)
    const link = screen.getByTestId('github-link')
    const svg = link.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('github-icon')
  })
})
