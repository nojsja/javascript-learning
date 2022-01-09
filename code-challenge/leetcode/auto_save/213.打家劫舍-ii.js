/*
 * @lc app=leetcode.cn id=213 lang=javascript
 *
 * [213] 打家劫舍 II
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
  var dp = [];
  var max = 0;

  if (nums.length <= 3) {
    return Math.max(nums[0], nums[1] || 0, nums[2] || 0);
  }

  dp[0] = nums[0];
  dp[1] = Math.max(nums[0], nums[1]);

  for (var i = 2; i < nums.length - 1; i++) {
    dp[i] = Math.max(dp[i - 1], nums[i] + dp[i - 2]);
  }
  max = dp.pop()
  dp.length = 0;

  dp[0] = nums[1];
  dp[1] = Math.max(nums[1], nums[2]);

  for (var i = 3; i < nums.length; i++) {
    dp[i - 1] = Math.max(dp[i - 2], nums[i] + dp[i - 3]);
  }

  max = Math.max(max, dp.pop());

  return max;
};
// @lc code=end

