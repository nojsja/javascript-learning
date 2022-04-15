/*
 * @lc app=leetcode.cn id=1909 lang=javascript
 *
 * [1909] 删除一个元素使数组严格递增
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canBeIncreasing = function(nums) {
  var asc = true;
  var length = nums.length;

  for (var i = 0; i < (length - 1); i++) {
    if (nums[i] >= nums[i+1]) {
      if (asc) {
        // 波峰
        if (i === 0 || nums[i+1] > nums[i - 1]) {
          asc = false;
        // 波谷
        } else if (i + 2 >= length || nums[i+2] > nums[i]) {
          asc = false;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }
  
  return true;

};
// @lc code=end

