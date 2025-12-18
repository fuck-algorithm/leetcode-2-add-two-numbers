import { useState, useCallback } from 'react'
import './DataInput.css'

interface DataInputProps {
  l1: number[]
  l2: number[]
  onDataChange: (l1: number[], l2: number[]) => void
}

// 预设数据样例
const PRESET_EXAMPLES = [
  { name: '示例1', l1: [2, 4, 3], l2: [5, 6, 4], desc: '342+465=807' },
  { name: '示例2', l1: [0], l2: [0], desc: '0+0=0' },
  { name: '示例3', l1: [9, 9, 9, 9, 9, 9, 9], l2: [9, 9, 9, 9], desc: '进位测试' },
  { name: '示例4', l1: [1, 8], l2: [0], desc: '81+0=81' },
]

/**
 * 验证输入字符串是否为合法的链表数据
 * 合法格式: 逗号分隔的0-9数字，如 "2,4,3" 或 "2, 4, 3"
 */
function validateInput(input: string): { valid: boolean; values: number[]; error: string } {
  const trimmed = input.trim()
  
  if (trimmed === '') {
    return { valid: false, values: [], error: '输入不能为空' }
  }

  // 分割并清理
  const parts = trimmed.split(',').map(s => s.trim())
  
  if (parts.some(p => p === '')) {
    return { valid: false, values: [], error: '存在空值，请检查逗号' }
  }

  const values: number[] = []
  for (const part of parts) {
    // 检查是否为有效数字
    if (!/^\d+$/.test(part)) {
      return { valid: false, values: [], error: `"${part}" 不是有效数字` }
    }
    
    const num = parseInt(part, 10)
    
    // 链表节点值必须是0-9
    if (num < 0 || num > 9) {
      return { valid: false, values: [], error: `节点值必须是0-9，"${num}" 超出范围` }
    }
    
    values.push(num)
  }

  // 限制链表长度
  if (values.length > 10) {
    return { valid: false, values: [], error: '链表长度不能超过10' }
  }

  return { valid: true, values, error: '' }
}

/**
 * 生成随机合法链表数据
 */
function generateRandomList(): number[] {
  const length = Math.floor(Math.random() * 5) + 1 // 1-5个节点
  const values: number[] = []
  
  for (let i = 0; i < length; i++) {
    values.push(Math.floor(Math.random() * 10)) // 0-9
  }
  
  return values
}

export function DataInput({ l1, l2, onDataChange }: DataInputProps) {
  const [l1Input, setL1Input] = useState(l1.join(', '))
  const [l2Input, setL2Input] = useState(l2.join(', '))
  const [l1Error, setL1Error] = useState('')
  const [l2Error, setL2Error] = useState('')

  // 应用数据
  const handleApply = useCallback(() => {
    const l1Result = validateInput(l1Input)
    const l2Result = validateInput(l2Input)

    setL1Error(l1Result.error)
    setL2Error(l2Result.error)

    if (l1Result.valid && l2Result.valid) {
      onDataChange(l1Result.values, l2Result.values)
    }
  }, [l1Input, l2Input, onDataChange])

  // 选择预设样例
  const handlePresetSelect = useCallback((preset: typeof PRESET_EXAMPLES[0]) => {
    setL1Input(preset.l1.join(', '))
    setL2Input(preset.l2.join(', '))
    setL1Error('')
    setL2Error('')
    onDataChange(preset.l1, preset.l2)
  }, [onDataChange])

  // 随机生成
  const handleRandom = useCallback(() => {
    const newL1 = generateRandomList()
    const newL2 = generateRandomList()
    setL1Input(newL1.join(', '))
    setL2Input(newL2.join(', '))
    setL1Error('')
    setL2Error('')
    onDataChange(newL1, newL2)
  }, [onDataChange])

  return (
    <div className="data-input" data-testid="data-input">
      <div className="data-input-row">
        <div className="input-group">
          <label className="input-label">L1:</label>
          <input
            type="text"
            className={`data-input-field ${l1Error ? 'error' : ''}`}
            value={l1Input}
            onChange={(e) => setL1Input(e.target.value)}
            placeholder="如: 2, 4, 3"
            data-testid="l1-input"
          />
          {l1Error && <span className="error-tip">{l1Error}</span>}
        </div>
        
        <div className="input-group">
          <label className="input-label">L2:</label>
          <input
            type="text"
            className={`data-input-field ${l2Error ? 'error' : ''}`}
            value={l2Input}
            onChange={(e) => setL2Input(e.target.value)}
            placeholder="如: 5, 6, 4"
            data-testid="l2-input"
          />
          {l2Error && <span className="error-tip">{l2Error}</span>}
        </div>

        <button 
          className="apply-btn" 
          onClick={handleApply}
          data-testid="apply-btn"
        >
          应用
        </button>
        
        <button 
          className="random-btn" 
          onClick={handleRandom}
          data-testid="random-btn"
        >
          🎲 随机
        </button>
      </div>

      <div className="preset-row">
        <span className="preset-label">样例:</span>
        {PRESET_EXAMPLES.map((preset, index) => (
          <button
            key={index}
            className="preset-btn"
            onClick={() => handlePresetSelect(preset)}
            title={preset.desc}
            data-testid={`preset-${index}`}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  )
}
