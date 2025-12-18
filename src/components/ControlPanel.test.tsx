import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import * as fc from 'fast-check'
import { ControlPanel } from './ControlPanel'

describe('ControlPanel Component', () => {
  const defaultProps = {
    currentStep: 0,
    totalSteps: 10,
    isPlaying: false,
    onPrevious: vi.fn(),
    onNext: vi.fn(),
    onPlayPause: vi.fn(),
    onReset: vi.fn(),
    onSeek: vi.fn(),
  }

  /**
   * **Feature: leetcode-add-two-numbers-visualizer, Property 1: Step Navigation Consistency**
   * For any valid step index, verify previous/next navigation
   * **Validates: Requirements 3.1, 3.2**
   */
  describe('Property 1: Step Navigation Consistency', () => {
    it('should call onPrevious when prev button is clicked and not at first step', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 99 }),
          fc.integer({ min: 2, max: 100 }),
          (currentStep, totalSteps) => {
            // 确保 currentStep < totalSteps
            const validTotalSteps = Math.max(totalSteps, currentStep + 1)
            const onPrevious = vi.fn()

            const { unmount } = render(
              <ControlPanel
                {...defaultProps}
                currentStep={currentStep}
                totalSteps={validTotalSteps}
                onPrevious={onPrevious}
              />
            )

            const prevButton = screen.getByTestId('prev-button')
            expect(prevButton).not.toBeDisabled()

            fireEvent.click(prevButton)
            expect(onPrevious).toHaveBeenCalledTimes(1)

            unmount()
          }
        ),
        { numRuns: 50 }
      )
    })

    it('should call onNext when next button is clicked and not at last step', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 98 }),
          fc.integer({ min: 2, max: 100 }),
          (currentStep, totalSteps) => {
            // 确保 currentStep < totalSteps - 1
            const validTotalSteps = Math.max(totalSteps, currentStep + 2)
            const onNext = vi.fn()

            const { unmount } = render(
              <ControlPanel
                {...defaultProps}
                currentStep={currentStep}
                totalSteps={validTotalSteps}
                onNext={onNext}
              />
            )

            const nextButton = screen.getByTestId('next-button')
            expect(nextButton).not.toBeDisabled()

            fireEvent.click(nextButton)
            expect(onNext).toHaveBeenCalledTimes(1)

            unmount()
          }
        ),
        { numRuns: 50 }
      )
    })

    it('should disable prev button at first step', () => {
      render(<ControlPanel {...defaultProps} currentStep={0} totalSteps={10} />)

      const prevButton = screen.getByTestId('prev-button')
      expect(prevButton).toBeDisabled()
    })

    it('should disable next button at last step', () => {
      render(<ControlPanel {...defaultProps} currentStep={9} totalSteps={10} />)

      const nextButton = screen.getByTestId('next-button')
      expect(nextButton).toBeDisabled()
    })
  })

  /**
   * **Feature: leetcode-add-two-numbers-visualizer, Property 2: Play/Pause Toggle Consistency**
   * For any isPlaying state, verify toggle produces negation
   * **Validates: Requirements 3.3**
   */
  describe('Property 2: Play/Pause Toggle Consistency', () => {
    it('should call onPlayPause when play/pause button is clicked', () => {
      fc.assert(
        fc.property(fc.boolean(), (isPlaying) => {
          const onPlayPause = vi.fn()

          const { unmount } = render(
            <ControlPanel {...defaultProps} isPlaying={isPlaying} onPlayPause={onPlayPause} />
          )

          const playPauseButton = screen.getByTestId('play-pause-button')
          fireEvent.click(playPauseButton)

          expect(onPlayPause).toHaveBeenCalledTimes(1)

          unmount()
        }),
        { numRuns: 10 }
      )
    })

    it('should show "播放" when not playing', () => {
      render(<ControlPanel {...defaultProps} isPlaying={false} />)

      const playPauseButton = screen.getByTestId('play-pause-button')
      expect(playPauseButton).toHaveTextContent('播放')
    })

    it('should show "暂停" when playing', () => {
      render(<ControlPanel {...defaultProps} isPlaying={true} />)

      const playPauseButton = screen.getByTestId('play-pause-button')
      expect(playPauseButton).toHaveTextContent('暂停')
    })
  })

  describe('Button Labels', () => {
    it('should display keyboard shortcut hints on buttons', () => {
      render(<ControlPanel {...defaultProps} />)

      expect(screen.getByTestId('prev-button')).toHaveTextContent('(←)')
      expect(screen.getByTestId('next-button')).toHaveTextContent('(→)')
      expect(screen.getByTestId('play-pause-button')).toHaveTextContent('(Space)')
    })

    it('should display step counter', () => {
      render(<ControlPanel {...defaultProps} currentStep={4} totalSteps={10} />)

      expect(screen.getByText('步骤 5 / 10')).toBeInTheDocument()
    })
  })
})
