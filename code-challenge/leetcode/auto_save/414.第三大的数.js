/*
 * @lc app=leetcode.cn id=414 lang=javascript
 *
 * [414] 第三大的数
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var thirdMax = function(nums) {
  nums = Array.from(new Set(nums)).sort((a, b) => a - b);

  return nums.length >= 3 ? nums[nums.length - 1 - 2] : nums.pop();
};
// @lc code=end

