/* -------------------------------------------------------
  description:
  给你一个链表和一个特定值 x ，请你对链表进行分隔，使得所有小于 x 的节点都出现在大于或等于 x 的节点之前。

  你应当保留两个分区中每个节点的初始相对位置。

  示例：

  输入：head = 1->4->3->2->5->2, x = 3
  输出：1->2->2->4->3->5

  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/partition-list
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */

/* Definition for singly-linked list. */
function ListNode(val) {
  this.val = val;
  this.next = null;
}

var listNodeConsole = function(list, array=[]) {
  if (list　&& list.next) listNodeConsole(list.next, array);
  if (list && list.val) array.unshift(list.val);

  return array;
}


/**
 * @param {ListNode} head
 * @param {number} x
 * @return {ListNode}
 */
var partition = function(head, x) {
  var parent = head;
  var node = head;
  var tmpNode = new ListNode();
  var cur = tmpNode;

  while(node) {
    if (node.val < x) {
      cur.next = node;
      cur = node;
      if (node === head) {
        head = head.next;
        node.next = null;
        node = head;
      } else {
        parent.next = node.next;
        node.next = null;
        node = parent.next;
      }
    } else {
      parent = node;
      node = node.next;
    }
    console.log(listNodeConsole(tmpNode), listNodeConsole(head));
  }

  if (cur !== tmpNode) {
    cur.next = head;
    tmpNode = tmpNode.next;
  } else {
    tmpNode = head;
  }
  
  return tmpNode;
};

// 1->4->3->2->5->2
var testNode = new ListNode(4);
var cur = testNode;
cur.next = new ListNode(4);
cur = cur.next;
cur.next = new ListNode(4);
cur = cur.next;
cur.next = new ListNode(4);
cur = cur.next;
cur.next = new ListNode(2);
cur = cur.next;
cur.next = new ListNode(4);
cur = cur.next;

console.log(partition(testNode, 3));