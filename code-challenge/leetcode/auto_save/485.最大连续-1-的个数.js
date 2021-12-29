/*
 * @lc app=leetcode.cn id=485 lang=javascript
 *
 * [485] 最大连续 1 的个数
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var findMaxConsecutiveOnes = function(nums) {
  var max = 0, cur = 0, i, length = nums.length;

  for (i = 0; i < length; i++) {
    if (nums[i] === 1) {
      cur++;
      max = Math.max(cur, max);
    } else {
      cur = 0;
    }
  }

  return max;
};
// @lc code=end

