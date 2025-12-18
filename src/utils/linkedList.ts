import { ListNode } from '../core/types'

/**
 * 将数组转换为链表
 * @param arr 数字数组
 * @returns 链表头节点，如果数组为空则返回 null
 */
export function arrayToLinkedList(arr: number[]): ListNode | null {
  if (arr.length === 0) {
    return null
  }

  const head = new ListNode(arr[0])
  let current = head

  for (let i = 1; i < arr.length; i++) {
    current.next = new ListNode(arr[i])
    current = current.next
  }

  return head
}

/**
 * 将链表转换为数组
 * @param head 链表头节点
 * @returns 数字数组
 */
export function linkedListToArray(head: ListNode | null): number[] {
  const result: number[] = []
  let current = head

  while (current !== null) {
    result.push(current.val)
    current = current.next
  }

  return result
}

/**
 * 获取链表长度
 * @param head 链表头节点
 * @returns 链表长度
 */
export function getLinkedListLength(head: ListNode | null): number {
  let length = 0
  let current = head

  while (current !== null) {
    length++
    current = current.next
  }

  return length
}

/**
 * 克隆链表
 * @param head 链表头节点
 * @returns 克隆后的链表头节点
 */
export function cloneLinkedList(head: ListNode | null): ListNode | null {
  if (head === null) {
    return null
  }

  const newHead = new ListNode(head.val)
  let current = head.next
  let newCurrent = newHead

  while (current !== null) {
    newCurrent.next = new ListNode(current.val)
    newCurrent = newCurrent.next
    current = current.next
  }

  return newHead
}
