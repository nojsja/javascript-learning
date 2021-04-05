/* -------------------------------------------------------
  description:
  请判断一个链表是否为回文链表。

  示例 1:

  输入: 1->2
  输出: false
  示例 2:

  输入: 1->2->2->1
  输出: true
  进阶：
  你能否用 O(n) 时间复杂度和 O(1) 空间复杂度解决此题？

  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/palindrome-linked-list
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */

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
  var fast = slow = head;
  var stack = [];
  var flag = false;

  while (fast) {
      stack.push(slow.val);
      slow = slow.next;
      if (fast.next) {
          fast = fast.next.next;
      } else {
          fast = null;
          flag = true;
      }
  }

  flag && (stack.pop());

  while (slow) {
      if (slow.val !== stack.pop()) {
          return false;
      }
      slow = slow.next;
  }

  return true;
};