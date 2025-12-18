import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DataInput } from './DataInput'

describe('DataInput', () => {
  const defaultProps = {
    l1: [2, 4, 3],
    l2: [5, 6, 4],
    onDataChange: vi.fn(),
  }

  it('应该渲染输入框和按钮', () => {
    render(<DataInput {...defaultProps} />)
    
    expect(screen.getByTestId('l1-input')).toBeInTheDocument()
    expect(screen.getByTestId('l2-input')).toBeInTheDocument()
    expect(screen.getByTestId('apply-btn')).toBeInTheDocument()
    expect(screen.getByTestId('random-btn')).toBeInTheDocument()
  })

  it('应该显示初始值', () => {
    render(<DataInput {...defaultProps} />)
    
    expect(screen.getByTestId('l1-input')).toHaveValue('2, 4, 3')
    expect(screen.getByTestId('l2-input')).toHaveValue('5, 6, 4')
  })

  it('应该渲染预设样例按钮', () => {
    render(<DataInput {...defaultProps} />)
    
    expect(screen.getByTestId('preset-0')).toBeInTheDocument()
    expect(screen.getByTestId('preset-1')).toBeInTheDocument()
    expect(screen.getByTestId('preset-2')).toBeInTheDocument()
    expect(screen.getByTestId('preset-3')).toBeInTheDocument()
  })

  it('点击预设样例应该更新输入并调用回调', () => {
    const onDataChange = vi.fn()
    render(<DataInput {...defaultProps} onDataChange={onDataChange} />)
    
    fireEvent.click(screen.getByTestId('preset-1'))
    
    expect(screen.getByTestId('l1-input')).toHaveValue('0')
    expect(screen.getByTestId('l2-input')).toHaveValue('0')
    expect(onDataChange).toHaveBeenCalledWith([0], [0])
  })

  it('点击随机按钮应该生成新数据', () => {
    const onDataChange = vi.fn()
    render(<DataInput {...defaultProps} onDataChange={onDataChange} />)
    
    fireEvent.click(screen.getByTestId('random-btn'))
    
    expect(onDataChange).toHaveBeenCalled()
  })

  it('输入无效数据应该显示错误', () => {
    render(<DataInput {...defaultProps} />)
    
    const l1Input = screen.getByTestId('l1-input')
    fireEvent.change(l1Input, { target: { value: 'abc' } })
    fireEvent.click(screen.getByTestId('apply-btn'))
    
    expect(screen.getByText(/"abc" 不是有效数字/)).toBeInTheDocument()
  })

  it('输入超出范围的数字应该显示错误', () => {
    render(<DataInput {...defaultProps} />)
    
    const l1Input = screen.getByTestId('l1-input')
    fireEvent.change(l1Input, { target: { value: '10' } })
    fireEvent.click(screen.getByTestId('apply-btn'))
    
    expect(screen.getByText(/节点值必须是0-9/)).toBeInTheDocument()
  })

  it('输入有效数据应该调用回调', () => {
    const onDataChange = vi.fn()
    render(<DataInput {...defaultProps} onDataChange={onDataChange} />)
    
    const l1Input = screen.getByTestId('l1-input')
    const l2Input = screen.getByTestId('l2-input')
    
    fireEvent.change(l1Input, { target: { value: '1, 2, 3' } })
    fireEvent.change(l2Input, { target: { value: '4, 5, 6' } })
    fireEvent.click(screen.getByTestId('apply-btn'))
    
    expect(onDataChange).toHaveBeenCalledWith([1, 2, 3], [4, 5, 6])
  })
})
