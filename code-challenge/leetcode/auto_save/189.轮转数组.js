/*
 * @lc app=leetcode.cn id=189 lang=javascript
 *
 * [189] 轮转数组
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var rotate = function(nums, k) {
  var length = nums.length;
  k = k % length;
  var deleted = nums.slice(-k);

  if (k === 0) return;

  nums.splice(length - k, k);
  nums.unshift(...deleted);
};
// @lc code=end

