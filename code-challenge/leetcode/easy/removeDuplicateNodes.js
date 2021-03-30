/* -------------------------------------------------------
  description:
  编写代码，移除未排序链表中的重复节点。保留最开始出现的节点。

  示例1:

  输入：[1, 2, 3, 3, 2, 1]
  输出：[1, 2, 3]
  示例2:

  输入：[1, 1, 1, 1, 2]
  输出：[1, 2]
  提示：

  链表长度在[0, 20000]范围内。
  链表元素在[0, 20000]范围内。
  进阶：

  如果不得使用临时缓冲区，该怎么解决？

  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/remove-duplicate-node-lcci
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */

/* 进阶：以时间换空间 */

/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
 var removeDuplicateNodes = function(head) {
  var now = head, next, last;

  while(now) {
    next = now.next;
    last = now;
    while (next) {
      if (next.val === now.val) {
        last.next = next.next;
      } else {
        last = next;
      }
      next = next.next;
    }
    now = now.next;
  }

  return head;
};

/* 进阶：以空间换时间 */

var removeDuplicateNodes = function(head) {
  if (!head) return head;

  var map = {
    [head.val]: 1,
  };
  var prev = head, next = head.next;

  while (next) {
    if (map[next.val]) {
      prev.next = next.next;
    } else {
      prev = next;
      map[next.val] = 1;
    }
    next = next.next;
  }

  return head;
}