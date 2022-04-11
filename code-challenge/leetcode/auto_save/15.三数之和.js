/*
 * @lc app=leetcode.cn id=15 lang=javascript
 *
 * [15] 三数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
  var res = [];
  var sum;
  var i, start, end, length = nums.length;

  nums = nums.sort((a, b) => a - b);

  for (i = 0; i < length - 2; i++) {
    if (nums[i] === nums[i - 1]) continue;
    start = i + 1;
    end = length - 1;
    while (start < end) {
      sum = nums[i] + nums[start] + nums[end];
      if (sum === 0) {
        res.push([nums[i], nums[start], nums[end]]);
        while ((start < end) && (nums[start] === nums[start + 1]))
          start ++;
        while ((start < end) && (nums[end] === nums[end - 1]))
          end --;
        start ++;
        end --;
      } else if (sum > 0) {
        end --;
      } else {
        start ++;
      }
    }
  }

  return res;
};
// @lc code=end

