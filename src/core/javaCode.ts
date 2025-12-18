/**
 * Java 算法代码
 */
export const JAVA_CODE = `public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
    ListNode newHead = new ListNode();
    ListNode p = newHead;
    int carry = 0;
    while (l1 != null || l2 != null || carry != 0) {
        if (l1 != null) {
            carry += l1.val;
            l1 = l1.next;
        }
        if (l2 != null) {
            carry += l2.val;
            l2 = l2.next;
        }
        p.next = new ListNode(carry % 10);
        carry = carry / 10;
        p = p.next;
    }
    return newHead.next;
}`

/**
 * 代码行数组（用于渲染）
 */
export const CODE_LINES_ARRAY = JAVA_CODE.split('\n')
