/*
 * @lc app=leetcode.cn id=234 lang=javascript
 *
 * [234] 回文链表
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
 * @return {boolean}
 */
var isPalindrome = function(head) {
  var right = reverse(findCenter(head));
  var left = head;

  while (left && right) {
    if (left.val === right.val) {
      left = left.next;
      right = right.next;
    } else {
      return false;
    }
  }

  return true;
};

var reverse = function(node) {
  var pre = null, cur = node, next;

  while (cur) {
    next = cur.next;
    cur.next = pre;
    node = cur;
    pre = cur;
    cur = next;
  }

  return node;
};

var findCenter = function(node) {
  var fast = slow = node;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // 奇数链表 slow 往后移动一位
  if (fast !== null)
    slow = slow.next; 

  return slow;
};
// @lc code=end

