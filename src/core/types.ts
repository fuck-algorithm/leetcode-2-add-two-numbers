/**
 * 单链表节点类
 */
export class ListNode {
  val: number
  next: ListNode | null

  constructor(val: number = 0, next: ListNode | null = null) {
    this.val = val
    this.next = next
  }
}

/**
 * 变量状态接口
 */
export interface VariableState {
  name: string
  value: string
  line: number
  type: 'pointer' | 'number' | 'node'
}

/**
 * 指针状态接口
 */
export interface PointerState {
  l1Position: number // -1 表示 null
  l2Position: number // -1 表示 null
  pPosition: number // -1 表示 null
}

/**
 * 链表状态接口
 */
export interface ListNodeState {
  values: number[]
  currentIndex: number // -1 表示指针为 null
}

/**
 * 算法步骤接口
 */
export interface AlgorithmStep {
  stepNumber: number
  codeLine: number
  description: string
  variables: VariableState[]
  l1State: ListNodeState | null
  l2State: ListNodeState | null
  resultState: ListNodeState | null
  carry: number
  pointers: PointerState
}

/**
 * 算法状态接口
 */
export interface AlgorithmState {
  currentStep: number
  steps: AlgorithmStep[]
  isPlaying: boolean
  playSpeed: number
}
