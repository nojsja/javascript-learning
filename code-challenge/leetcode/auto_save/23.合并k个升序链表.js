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
// var mergeKLists = function(lists) {
//   var l1, l2, l, tmp, lastL1, lastL2;

//   for (var i = 0; i < lists.length; i++) {
//     if (!lists[i]) {
//       continue;
//     }
//     if (!l1) {
//       l1 = lists[i];
//       continue;
//     }
//     l2 = lists[i];
//     l = l1.val <= l2.val ? l1 : l2;
//     tmp = {};
//     lastL1 = l1;
//     lastL2 = l2;

//     while (l1 && l2) {
//       if (l1.val <= l2.val) {
//         tmp.next = l1;
//         lastL1 = l1;
//         l1 = l1.next;
//       } else {
//         tmp.next = l2;
//         lastL2 = l2;
//         l2 = l2.next;
//       }
//       tmp = tmp.next;
//     }

//     if ((l1 || l2)) {
//       if (l1) {
//         lastL2.next = l1;
//       } else {
//         lastL1.next = l2;
//       }
//     }

//     l1 = l;
//   }

//   return l1 || null;
// };

/* 分治法 - 递归 */
var mergeKLists = function(lists) {
  if (!lists.length) return null;

  var mergeAction = function(l1, l2) {
    var head = {}, pre = head;
    pre.next = null;

    while (l1 && l2) {
      lastL1 = l1;
      lastL2 = l2;
      if (l1.val < l2.val) {
        pre.next = l1;
        l1 = l1.next;
      } else {
        pre.next = l2;
        l2 = l2.next;
      }
      pre = pre.next;
    }

    pre.next = l1 || l2;

    return head.next;
  };

  var merge = function(nodesArray, left, right) {
    if (left > right) return null;
    if (left === right) return lists[left];

    const middle = (left + right) >> 1;
    return mergeAction(merge(nodesArray, left, middle), merge(nodesArray, middle + 1, right));
  };

  return merge(lists, 0, lists.length - 1);
};
// @lc code=end