/* -------------------------------------------------------
  description:
  将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 
  输入：l1 = [1,2,4], l2 = [1,3,4]
  输出：[1,1,2,3,4,4]
  示例 2：

  输入：l1 = [], l2 = []
  输出：[]
  示例 3：

  输入：l1 = [], l2 = [0]
  输出：[0]


  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/merge-two-sorted-lists
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */

const { buildLinkList } = require('../utils');

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var mergeTwoLists = function(l1, l2) {
  var cur1 = l1, cur2 = l2, tmp;

  if (!l1 || !l2) return l1 || l2;
  
  while (cur1 && cur2) {
    if (cur2.val <= cur1.val) {
      if (!cur2.next || cur2.next.val >= cur1.val) {
        tmp = cur2.next;
        cur2.next = cur1;
        cur1 = cur1.next;
        cur2.next.next = tmp;
      } else {
        cur2 = cur2.next;
      }
    } else {
      tmp = cur1.next;
      cur1.next = cur2;
      cur2 = cur1;
      l2 = cur1;
      cur1 = tmp;
    }
  }

  return l2;
};

/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
 var mergeTwoLists = function(l1, l2) {
  if (!l1 || !l2) return l1 || l2;

  if (l1.val < l2.val) {
    l1.next = mergeTwoLists(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoLists(l1, l2.next);
    return l2;
  }
};

console.log(JSON.stringify(mergeTwoLists(buildLinkList([1,2,4]), buildLinkList([1,3,4]))))