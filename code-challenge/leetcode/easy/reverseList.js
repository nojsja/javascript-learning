/* -------------------------------------------------------
  description:

  反转一个单链表。

  示例:

  输入: 1->2->3->4->5->NULL
  输出: 5->4->3->2->1->NULL
  进阶:
  你可以迭代或递归地反转链表。你能否用两种方法解决这道题？



  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/reverse-linked-list
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */
const { buildLinkList } = require('../utils');

var linkList = buildLinkList([1,2,3,4,5]);

var reverseList = function(head) {
  var cur = null, tmp;

  while (head) {
    tmp = head.next;
    head.next = cur;
    cur = head;
    head = tmp;
  }

  return cur;
};

console.log(JSON.stringify(reverseList(linkList)));