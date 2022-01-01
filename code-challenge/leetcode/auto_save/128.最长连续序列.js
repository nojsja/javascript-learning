/*
 * @lc app=leetcode.cn id=128 lang=javascript
 *
 * [128] 最长连续序列
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function(nums) {
  var record = new Set(nums);
  var max = nums.length ? 1 : 0;

  for (var i = 0; i < nums.length; i++) {
    if (!record.has(nums[i] - 1)) {
      var cur = nums[i] + 1;
      var tmp = 1;
      while(record.has(cur)) {
        tmp += 1;
        max = Math.max(max, tmp);
        cur += 1;
      }
    }
  }

  return max;
};
// @lc code=end

