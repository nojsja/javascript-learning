/*
 * @lc app=leetcode.cn id=2099 lang=javascript
 *
 * [2099] 找到和最大的长度为 K 的子序列
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSubsequence = function(nums, k) {
  return nums
    .map((item, index) => [index, item])
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .sort((a, b) => a[0] - b[0])
    .map(item => item[1]);

};
// @lc code=end

