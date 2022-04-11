/*
 * @lc app=leetcode.cn id=16 lang=javascript
 *
 * [16] 最接近的三数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var threeSumClosest = function(nums, target) {
  var sum = nums[0] + nums[1] + nums[2];
  var res, start, end, length = nums.length;

  nums = nums.sort((a, b) => a - b);

  for (var i = 0; i < length - 2; i++) {
    start = i + 1;
    end = length - 1;

    while (start < end) {
      res = nums[i] + nums[start] + nums[end];
      if (Math.abs(target - res) < Math.abs(target - sum)) {
        sum = res;
      }
      if (res > target) {
        end --;
      } else if (res < target) {
        start ++;
      } else {
        return res;
      }
    }
  }

  return sum;
};
// @lc code=end

