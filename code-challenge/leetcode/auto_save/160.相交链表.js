/*
 * @lc app=leetcode.cn id=160 lang=javascript
 *
 * [160] 相交链表
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
var getIntersectionNode = function(headA, headB) {
  var length = 0;
  var l1 = headA;
  var l2 = headB;

  if (!l1 || !l2) return null;

  while (l1.next) {
    length++;
    l1 = l1.next;
  }
  while (l2.next) {
    length--;
    l2 = l2.next;
  }

  if (l1 !== l2) return null;

  if (length > 0) {
    l1 = headA;
    l2 = headB;
  } else {
    l1 = headB;
    l2 = headA;
  }

  length = Math.abs(length);

  while (l1 && l2) {
    if (l1 === l2) return l1;
    if (length-- > 0) {
      l1 = l1.next;
    } else {
      l2 = l2.next;
      l1 = l1.next;
    }
  }

  return null;
};
// @lc code=end

