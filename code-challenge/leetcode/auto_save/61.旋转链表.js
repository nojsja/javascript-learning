/*
 * @lc app=leetcode.cn id=61 lang=javascript
 *
 * [61] 旋转链表
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var rotateRight = function(head, k) {
  var length = 0, pre = head, cur, last;

  if (!k) return head;

  while(pre) {
    length++;
    last = pre;
    pre = pre.next;
  }

  k = k % length;
  if (!k) return head;
  k = length - (k % length);
  pre = head;
  
  while (--k) {
    pre = pre.next;
  }

  cur = pre.next;
  pre.next = null;
  last.next = head;

  return cur;
};
// @lc code=end

