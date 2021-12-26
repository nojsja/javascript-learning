/* -------------------------------------------------------
  description:
  给你一个链表的头节点 head ，判断链表中是否有环。

  如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。如果 pos 是 -1，则在该链表中没有环。注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。

  如果链表中存在环，则返回 true 。 否则，返回 false 。

  给你一个链表的头节点 head ，判断链表中是否有环。
  如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，评测系统内部使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。如果 pos 是 -1，则在该链表中没有环。注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。
  如果链表中存在环，则返回 true 。 否则，返回 false 。

  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/linked-list-cycle
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */

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
 var hasCycle = function(head) {
  if (!head) return false;
  
  var p1 = head, p2 = head.next;

  while(p1 && p2) {
    if (p1 === p2)
      return true;
    p1 = p1.next;
    p2 = p2.next ? p2.next.next : null;
  }

  return false;
};