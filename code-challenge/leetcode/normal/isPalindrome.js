/* -------------------------------------------------------
  description
  编写一个函数，检查输入的链表是否是回文的。

  示例 1：

  输入： 1->2
  输出： false 
  示例 2：

  输入： 1->2->2->1
  输出： true 
   

  进阶：
  你能否用 O(n) 时间复杂度和 O(1) 空间复杂度解决此题？

  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/palindrome-linked-list-lcci
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */

/*
  思路：
  题目中判断回文链表用栈的解决方法很简单，用空间换时间
  这里给出的是进阶要求的题解：O(n)时间复杂度和O(1)空间复杂度

  注意点：
  1. 需要首先求链表的长度，然后再反转链表的前半部分，最后中中节点开始比较前半部分和后半部分是否相等
  2. 注意奇数和偶数节点链表的不同处理，奇数链表的中节点不需要进行比较，所以直接从中节点两边开始比较每个节点的值是否相同。
*/

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {boolean}
 */
 var isPalindrome = function(head) {
  var length = 0, p1, p2, i = 0, tmp;

  p1 = head;

  while (p1) {
    length += 1;
    p1 = p1.next;
  }

  if (length < 2) return true;
  p1 = head;
  p2 = null;

  for (i; i < length / 2; i) {
    tmp = p2;
    p2 = p1;
    p1 = p1.next;
    p2.next = tmp;
    if (++i >= length / 2) {
      if (length % 2 !== 0)  {
        p2 = p2.next;
      }
      while (p1 && p2) {
        if (p1.val !== p2.val) {
          return false;
        }
        p1 = p1.next;
        p2 = p2.next;
      }
      return true;
    }
  }
};