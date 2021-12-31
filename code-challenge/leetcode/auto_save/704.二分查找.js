/*
 * @lc app=leetcode.cn id=704 lang=javascript
 *
 * [704] 二分查找
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
  var left = 0, right = nums.length - 1, mid = Math.floor((left + right) / 2);

  while (mid !== right && mid !== left) {
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) left = mid;
    if (nums[mid] > target) right = mid;
    mid = Math.floor((left + right) / 2);
  }

  if (nums[left] === target) return left;
  if (nums[right] === target) return right;

  return -1;
};
// @lc code=end

