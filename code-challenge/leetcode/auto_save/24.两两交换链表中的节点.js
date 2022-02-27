/*
 * @lc app=leetcode.cn id=24 lang=javascript
 *
 * [24] 两两交换链表中的节点
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
 * @return {ListNode}
 */
var swapPairs = function(head) {
  if (!head) return null;
  
  var pre = head, next = pre.next, tmp, cur = new ListNode(null);

  head = next || pre;

  while(pre && next) {
    tmp = next.next;
    next.next = pre;
    pre.next = tmp;
    cur.next = next;
    cur = pre;
    
    if (tmp) {
      pre = tmp;
      next = pre.next;
    } else {
      break;
    }
  }

  return head;
};
// @lc code=end

