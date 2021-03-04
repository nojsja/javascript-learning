function ListNode(val, next) {
  this.val = (val===undefined ? 0 : val)
  this.next = (next===undefined ? null : next)
};

/* 根据数组创建链表节点 */
exports.buildLinkList = function(array) {
  var val = array.shift();
  head = (val !== undefined) ? new ListNode(val, array.length ? exports.buildLinkList(array) : null) : null;
  return head;
};
