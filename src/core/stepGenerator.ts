import { AlgorithmStep, ListNode, VariableState, PointerState, ListNodeState } from './types'
import { arrayToLinkedList, linkedListToArray } from '../utils/linkedList'

/**
 * Java 代码行号映射
 */
export const CODE_LINES = {
  FUNCTION_START: 1,
  NEW_HEAD_INIT: 2,
  P_INIT: 3,
  CARRY_INIT: 4,
  WHILE_CONDITION: 5,
  IF_L1_NOT_NULL: 6,
  CARRY_ADD_L1: 7,
  L1_NEXT: 8,
  IF_L2_NOT_NULL: 10,
  CARRY_ADD_L2: 11,
  L2_NEXT: 12,
  P_NEXT_NEW_NODE: 14,
  CARRY_DIV: 15,
  P_MOVE: 16,
  RETURN: 18,
}

/**
 * 获取指针在链表中的位置
 */
function getPointerPosition(head: ListNode | null, pointer: ListNode | null): number {
  if (pointer === null) return -1
  let position = 0
  let current = head
  while (current !== null) {
    if (current === pointer) return position
    position++
    current = current.next
  }
  return -1
}

/**
 * 创建链表状态
 */
function createListState(
  head: ListNode | null,
  currentPointer: ListNode | null
): ListNodeState | null {
  if (head === null) return null
  return {
    values: linkedListToArray(head),
    currentIndex: getPointerPosition(head, currentPointer),
  }
}

/**
 * 创建变量状态数组
 */
function createVariables(
  l1: ListNode | null,
  l2: ListNode | null,
  carry: number,
  p: ListNode | null,
  newHead: ListNode | null
): VariableState[] {
  const variables: VariableState[] = []

  // l1 变量 - 在第7行显示
  variables.push({
    name: 'l1',
    value: l1 ? `ListNode(${l1.val})` : 'null',
    line: 7,
    type: 'pointer',
  })

  // l2 变量 - 在第11行显示
  variables.push({
    name: 'l2',
    value: l2 ? `ListNode(${l2.val})` : 'null',
    line: 11,
    type: 'pointer',
  })

  // carry 变量 - 在第4行显示
  variables.push({
    name: 'carry',
    value: carry.toString(),
    line: 4,
    type: 'number',
  })

  // p 变量 - 在第3行显示
  variables.push({
    name: 'p',
    value: p ? `ListNode(${p.val})` : 'null',
    line: 3,
    type: 'pointer',
  })

  // newHead 变量 - 在第2行显示
  variables.push({
    name: 'newHead',
    value: newHead ? `ListNode(${newHead.val})` : 'null',
    line: 2,
    type: 'node',
  })

  return variables
}

/**
 * 生成算法执行步骤
 * @param l1Arr 第一个链表的数组表示
 * @param l2Arr 第二个链表的数组表示
 * @returns 算法步骤数组
 */
export function generateSteps(l1Arr: number[], l2Arr: number[]): AlgorithmStep[] {
  const steps: AlgorithmStep[] = []
  let stepNumber = 0

  // 创建原始链表（用于状态显示）
  const originalL1 = arrayToLinkedList(l1Arr)
  const originalL2 = arrayToLinkedList(l2Arr)

  // 工作指针
  let l1: ListNode | null = arrayToLinkedList(l1Arr)
  let l2: ListNode | null = arrayToLinkedList(l2Arr)

  // 初始化 newHead
  const newHead = new ListNode()
  let p: ListNode | null = newHead
  let carry = 0

  // 结果链表头（用于显示）
  const resultHead = newHead

  // 创建指针状态
  const createPointers = (): PointerState => ({
    l1Position: getPointerPosition(originalL1, l1),
    l2Position: getPointerPosition(originalL2, l2),
    pPosition: getPointerPosition(resultHead, p),
  })

  // 步骤1: 初始化 newHead
  steps.push({
    stepNumber: stepNumber++,
    codeLine: CODE_LINES.NEW_HEAD_INIT,
    description: '创建哨兵节点 newHead',
    variables: createVariables(l1, l2, carry, p, newHead),
    l1State: createListState(originalL1, l1),
    l2State: createListState(originalL2, l2),
    resultState: { values: [], currentIndex: 0 },
    carry,
    pointers: createPointers(),
  })

  // 步骤2: 初始化 p = newHead
  steps.push({
    stepNumber: stepNumber++,
    codeLine: CODE_LINES.P_INIT,
    description: '初始化指针 p 指向 newHead',
    variables: createVariables(l1, l2, carry, p, newHead),
    l1State: createListState(originalL1, l1),
    l2State: createListState(originalL2, l2),
    resultState: { values: [], currentIndex: 0 },
    carry,
    pointers: createPointers(),
  })

  // 步骤3: 初始化 carry = 0
  steps.push({
    stepNumber: stepNumber++,
    codeLine: CODE_LINES.CARRY_INIT,
    description: '初始化进位 carry = 0',
    variables: createVariables(l1, l2, carry, p, newHead),
    l1State: createListState(originalL1, l1),
    l2State: createListState(originalL2, l2),
    resultState: { values: [], currentIndex: 0 },
    carry,
    pointers: createPointers(),
  })

  // 主循环
  while (l1 !== null || l2 !== null || carry !== 0) {
    // 检查 while 条件
    steps.push({
      stepNumber: stepNumber++,
      codeLine: CODE_LINES.WHILE_CONDITION,
      description: `检查循环条件: l1=${l1 !== null}, l2=${l2 !== null}, carry=${carry}`,
      variables: createVariables(l1, l2, carry, p, newHead),
      l1State: createListState(originalL1, l1),
      l2State: createListState(originalL2, l2),
      resultState: { values: linkedListToArray(resultHead.next), currentIndex: -1 },
      carry,
      pointers: createPointers(),
    })

    // 处理 l1
    if (l1 !== null) {
      steps.push({
        stepNumber: stepNumber++,
        codeLine: CODE_LINES.IF_L1_NOT_NULL,
        description: `l1 不为空，进入 if 分支`,
        variables: createVariables(l1, l2, carry, p, newHead),
        l1State: createListState(originalL1, l1),
        l2State: createListState(originalL2, l2),
        resultState: { values: linkedListToArray(resultHead.next), currentIndex: -1 },
        carry,
        pointers: createPointers(),
      })

      carry += l1.val
      steps.push({
        stepNumber: stepNumber++,
        codeLine: CODE_LINES.CARRY_ADD_L1,
        description: `carry += l1.val (${l1.val})，carry = ${carry}`,
        variables: createVariables(l1, l2, carry, p, newHead),
        l1State: createListState(originalL1, l1),
        l2State: createListState(originalL2, l2),
        resultState: { values: linkedListToArray(resultHead.next), currentIndex: -1 },
        carry,
        pointers: createPointers(),
      })

      l1 = l1.next
      steps.push({
        stepNumber: stepNumber++,
        codeLine: CODE_LINES.L1_NEXT,
        description: `l1 移动到下一个节点`,
        variables: createVariables(l1, l2, carry, p, newHead),
        l1State: createListState(originalL1, l1),
        l2State: createListState(originalL2, l2),
        resultState: { values: linkedListToArray(resultHead.next), currentIndex: -1 },
        carry,
        pointers: createPointers(),
      })
    }

    // 处理 l2
    if (l2 !== null) {
      steps.push({
        stepNumber: stepNumber++,
        codeLine: CODE_LINES.IF_L2_NOT_NULL,
        description: `l2 不为空，进入 if 分支`,
        variables: createVariables(l1, l2, carry, p, newHead),
        l1State: createListState(originalL1, l1),
        l2State: createListState(originalL2, l2),
        resultState: { values: linkedListToArray(resultHead.next), currentIndex: -1 },
        carry,
        pointers: createPointers(),
      })

      carry += l2.val
      steps.push({
        stepNumber: stepNumber++,
        codeLine: CODE_LINES.CARRY_ADD_L2,
        description: `carry += l2.val (${l2.val})，carry = ${carry}`,
        variables: createVariables(l1, l2, carry, p, newHead),
        l1State: createListState(originalL1, l1),
        l2State: createListState(originalL2, l2),
        resultState: { values: linkedListToArray(resultHead.next), currentIndex: -1 },
        carry,
        pointers: createPointers(),
      })

      l2 = l2.next
      steps.push({
        stepNumber: stepNumber++,
        codeLine: CODE_LINES.L2_NEXT,
        description: `l2 移动到下一个节点`,
        variables: createVariables(l1, l2, carry, p, newHead),
        l1State: createListState(originalL1, l1),
        l2State: createListState(originalL2, l2),
        resultState: { values: linkedListToArray(resultHead.next), currentIndex: -1 },
        carry,
        pointers: createPointers(),
      })
    }

    // 创建新节点
    const newVal = carry % 10
    p!.next = new ListNode(newVal)
    steps.push({
      stepNumber: stepNumber++,
      codeLine: CODE_LINES.P_NEXT_NEW_NODE,
      description: `创建新节点 p.next = new ListNode(${newVal})`,
      variables: createVariables(l1, l2, carry, p, newHead),
      l1State: createListState(originalL1, l1),
      l2State: createListState(originalL2, l2),
      resultState: { values: linkedListToArray(resultHead.next), currentIndex: -1 },
      carry,
      pointers: createPointers(),
    })

    // 更新 carry
    carry = Math.floor(carry / 10)
    steps.push({
      stepNumber: stepNumber++,
      codeLine: CODE_LINES.CARRY_DIV,
      description: `更新进位 carry = ${carry}`,
      variables: createVariables(l1, l2, carry, p, newHead),
      l1State: createListState(originalL1, l1),
      l2State: createListState(originalL2, l2),
      resultState: { values: linkedListToArray(resultHead.next), currentIndex: -1 },
      carry,
      pointers: createPointers(),
    })

    // 移动 p
    p = p!.next
    steps.push({
      stepNumber: stepNumber++,
      codeLine: CODE_LINES.P_MOVE,
      description: `p 移动到下一个节点`,
      variables: createVariables(l1, l2, carry, p, newHead),
      l1State: createListState(originalL1, l1),
      l2State: createListState(originalL2, l2),
      resultState: { values: linkedListToArray(resultHead.next), currentIndex: -1 },
      carry,
      pointers: createPointers(),
    })
  }

  // 最后检查 while 条件（退出循环）
  steps.push({
    stepNumber: stepNumber++,
    codeLine: CODE_LINES.WHILE_CONDITION,
    description: `循环条件不满足，退出循环`,
    variables: createVariables(l1, l2, carry, p, newHead),
    l1State: createListState(originalL1, l1),
    l2State: createListState(originalL2, l2),
    resultState: { values: linkedListToArray(resultHead.next), currentIndex: -1 },
    carry,
    pointers: createPointers(),
  })

  // 返回结果
  steps.push({
    stepNumber: stepNumber++,
    codeLine: CODE_LINES.RETURN,
    description: `返回 newHead.next，结果为 [${linkedListToArray(resultHead.next).join(', ')}]`,
    variables: createVariables(l1, l2, carry, p, newHead),
    l1State: createListState(originalL1, l1),
    l2State: createListState(originalL2, l2),
    resultState: { values: linkedListToArray(resultHead.next), currentIndex: -1 },
    carry,
    pointers: createPointers(),
  })

  return steps
}
