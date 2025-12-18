import { useEffect, useCallback } from 'react'

interface KeyboardShortcutsOptions {
  onPrevious: () => void
  onNext: () => void
  onPlayPause: () => void
}

/**
 * 键盘快捷键 Hook
 * - 左方向键: 上一步
 * - 右方向键: 下一步
 * - 空格键: 播放/暂停
 */
export function useKeyboardShortcuts({
  onPrevious,
  onNext,
  onPlayPause,
}: KeyboardShortcutsOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // 忽略在输入框中的按键
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          onPrevious()
          break
        case 'ArrowRight':
          event.preventDefault()
          onNext()
          break
        case ' ':
          event.preventDefault()
          onPlayPause()
          break
      }
    },
    [onPrevious, onNext, onPlayPause]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}
