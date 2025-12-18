import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { arrayToLinkedList, linkedListToArray } from './linkedList'

describe('LinkedList Utilities', () => {
  /**
   * **Feature: leetcode-add-two-numbers-visualizer, Property 4: Step Generation Completeness**
   * (partial - data structure validation)
   * Test round-trip conversion: arrayToLinkedList then linkedListToArray returns original array
   * **Validates: Requirements 5.1**
   */
  describe('Property 4: Round-trip conversion', () => {
    it('should return original array after arrayToLinkedList then linkedListToArray', () => {
      fc.assert(
        fc.property(
          fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 0, maxLength: 100 }),
          (arr) => {
            const linkedList = arrayToLinkedList(arr)
            const result = linkedListToArray(linkedList)
            expect(result).toEqual(arr)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should handle empty array', () => {
      const linkedList = arrayToLinkedList([])
      expect(linkedList).toBeNull()
      expect(linkedListToArray(linkedList)).toEqual([])
    })

    it('should handle single element array', () => {
      const linkedList = arrayToLinkedList([5])
      expect(linkedList).not.toBeNull()
      expect(linkedList?.val).toBe(5)
      expect(linkedList?.next).toBeNull()
      expect(linkedListToArray(linkedList)).toEqual([5])
    })

    it('should handle array with multiple elements', () => {
      const arr = [2, 4, 3]
      const linkedList = arrayToLinkedList(arr)
      expect(linkedListToArray(linkedList)).toEqual(arr)
    })
  })
})
