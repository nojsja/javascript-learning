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

/* 分治法 - 递归
class Solution {
public:
    ListNode* mergeTwoLists(ListNode *a, ListNode *b) {
        if ((!a) || (!b)) return a ? a : b;
        ListNode head, *tail = &head, *aPtr = a, *bPtr = b;
        while (aPtr && bPtr) {
            if (aPtr->val < bPtr->val) {
                tail->next = aPtr; aPtr = aPtr->next;
            } else {
                tail->next = bPtr; bPtr = bPtr->next;
            }
            tail = tail->next;
        }
        tail->next = (aPtr ? aPtr : bPtr);
        return head.next;
    }

    ListNode* merge(vector <ListNode*> &lists, int l, int r) {
        if (l == r) return lists[l];
        if (l > r) return nullptr;
        int mid = (l + r) >> 1;
        return mergeTwoLists(merge(lists, l, mid), merge(lists, mid + 1, r));
    }

    ListNode* mergeKLists(vector<ListNode*>& lists) {
        return merge(lists, 0, lists.size() - 1);
    }
};

作者：LeetCode-Solution
链接：https://leetcode-cn.com/problems/merge-k-sorted-lists/solution/he-bing-kge-pai-xu-lian-biao-by-leetcode-solutio-2/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
*/