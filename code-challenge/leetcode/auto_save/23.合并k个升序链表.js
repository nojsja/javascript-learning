/*
 * @lc app=leetcode.cn id=23 lang=javascript
 *
 * [23] 合并K个升序链表
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function(lists) {
  var l1, l2, l, tmp, lastL1, lastL2;

  for (var i = 0; i < lists.length; i++) {
    if (!lists[i]) {
      continue;
    }
    if (!l1) {
      l1 = lists[i];
      continue;
    }
    l2 = lists[i];
    l = l1.val <= l2.val ? l1 : l2;
    tmp = {};
    lastL1 = l1;
    lastL2 = l2;

    while (l1 && l2) {
      if (l1.val <= l2.val) {
        tmp.next = l1;
        lastL1 = l1;
        l1 = l1.next;
      } else {
        tmp.next = l2;
        lastL2 = l2;
        l2 = l2.next;
      }
      tmp = tmp.next;
    }

    if ((l1 || l2)) {
      if (l1) {
        lastL2.next = l1;
      } else {
        lastL1.next = l2;
      }
    }

    l1 = l;
  }

  return l1 || null;
};
// @lc code=end

