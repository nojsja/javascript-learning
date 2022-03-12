/*
 * @lc app=leetcode.cn id=88 lang=javascript
 *
 * [88] 合并两个有序数组
 */

// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function(nums1, m, nums2, n) {
  var i = j = 0;
  var cur = 0;
  nums1.splice(m, nums1.length - m);

  if (m === 0) {
    nums1.push(...nums2);
    return;
  }

  for (i = 0; i < n; i++) {
    j = nums1.length - 1;
    while (j >= cur) {
      if (nums2[i] >= nums1[j]) {
        nums1.splice(j + 1, 0, nums2[i]);
        cur = j + 1;
        break;
      } else {
        j--;
        if (j < cur) {
          nums1.unshift(nums2[i]);
        }
      }
    }
  }
};
// @lc code=end

