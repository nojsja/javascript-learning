/* -------------------------------------------------------
  description:
  
------------------------------------------------------- */

/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function(head, n) {
  var cur = head, head2 = head, pre = head;
  while(--n > 0) {
    if (cur.next) {
      cur = cur.next;
    } else {
      cur = head;
      break;
    }
  }
  while (cur.next) {
    pre = head2;
    head2 = head2.next;
    cur = cur.next;
  }

  if (pre !== head2) {
    pre.next = head2.next;
    return head;
  } else {
    return head.next;
  }
};