/* -------------------------------------------------------
  description:
  给出两个 非空 的链表用来表示两个非负的整数。其中，它们各自的位数是按照 逆序 的方式存储的，并且它们的每个节点只能存储 一位 数字。

  如果，我们将这两个数相加起来，则会返回一个新的链表来表示它们的和。

  您可以假设除了数字 0 之外，这两个数都不会以 0 开头。

  示例：

  输入：(2 -> 4 -> 3) + (5 -> 6 -> 4)
  输出：7 -> 0 -> 8
  原因：342 + 465 = 807
};
------------------------------------------------------- */

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

function ListNode(val, next) {
       this.val = (val===undefined ? 0 : val)
       this.next = (next===undefined ? null : next)
}

var addTwoNumbers = function(l1, l2) {
  var l11=l1.next, l22=l2.next;
  var stack1 = [l1.val];
  var stack2 = [l2.val];
  var lt = new ListNode();
  var flag = 0;
  var tmp, next = lt;

  while(l11 || l22) {
    tmp = new ListNode();
    next.next = tmp
    next = tmp;
    
    if (l11) {
      stack1.unshift(l11.val);
      l11 = l11.next;
    }
    if (l22) {
      stack2.unshift(l22.val);
      l22 = l22.next;
    }
  }

  next = lt;

  for (var i = 0; (stack2[i] || stack1[i]); i++) {
    stack1[i] = ((stack1[i] || 0) + (stack2[i] || 0) + flag);
    if (stack1[i] > 9) {
      stack1[i] = (stack1[i] - 10);
      flag = 1;
    } else {
      flag = 0;
    }
    next.val = stack1[i];
    next = next.next ? next.next : next;
  }

  if (flag === 1) next.next = new ListNode(flag)

  return lt;
};

var l1 = new ListNode(2);
l1.next = new ListNode(4);
l1.next.next = new ListNode(3);

var l2 = new ListNode(5);
l2.next = new ListNode(6);
l2.next.next = new ListNode(4);

console.log(addTwoNumbers(l1, l2));