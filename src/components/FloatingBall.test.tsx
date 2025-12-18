import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FloatingBall } from './FloatingBall'

describe('FloatingBall Component', () => {
  /**
   * Unit tests for FloatingBall component
   * **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**
   */

  it('should render floating ball with "交流群" text', () => {
    render(<FloatingBall />)

    const floatingBall = screen.getByTestId('floating-ball')
    expect(floatingBall).toBeInTheDocument()
    expect(floatingBall).toHaveTextContent('交流群')
  })

  it('should render WeChat icon', () => {
    render(<FloatingBall />)

    const floatingBall = screen.getByTestId('floating-ball')
    const svg = floatingBall.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('wechat-icon')
  })

  it('should not show popup initially', () => {
    render(<FloatingBall />)

    expect(screen.queryByTestId('qr-popup')).not.toBeInTheDocument()
  })

  it('should show popup on hover', () => {
    render(<FloatingBall />)

    const floatingBall = screen.getByTestId('floating-ball')
    fireEvent.mouseEnter(floatingBall)

    expect(screen.getByTestId('qr-popup')).toBeInTheDocument()
  })

  it('should hide popup on mouse leave', () => {
    render(<FloatingBall />)

    const floatingBall = screen.getByTestId('floating-ball')

    // Hover to show popup
    fireEvent.mouseEnter(floatingBall)
    expect(screen.getByTestId('qr-popup')).toBeInTheDocument()

    // Leave to hide popup
    fireEvent.mouseLeave(floatingBall)
    expect(screen.queryByTestId('qr-popup')).not.toBeInTheDocument()
  })

  it('should display QR code image in popup', () => {
    render(<FloatingBall />)

    const floatingBall = screen.getByTestId('floating-ball')
    fireEvent.mouseEnter(floatingBall)

    const qrImage = screen.getByTestId('qr-image')
    expect(qrImage).toBeInTheDocument()
    expect(qrImage).toHaveAttribute('alt', '微信交流群二维码')
  })

  it('should display instruction text in popup', () => {
    render(<FloatingBall />)

    const floatingBall = screen.getByTestId('floating-ball')
    fireEvent.mouseEnter(floatingBall)

    const hint = screen.getByTestId('qr-hint')
    expect(hint).toHaveTextContent('使用微信扫码发送 leetcode 加入算法交流群')
  })

  it('should maintain image aspect ratio with CSS', () => {
    render(<FloatingBall />)

    const floatingBall = screen.getByTestId('floating-ball')
    fireEvent.mouseEnter(floatingBall)

    const qrImage = screen.getByTestId('qr-image')
    expect(qrImage).toHaveClass('qr-image')
    // CSS class qr-image has object-fit: contain and aspect-ratio: auto
  })
})
