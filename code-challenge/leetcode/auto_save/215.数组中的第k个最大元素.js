/*
 * @lc app=leetcode.cn id=215 lang=javascript
 *
 * [215] 数组中的第K个最大元素
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function(nums, k) {
  var quickSort = function(arrays) {
    if (!arrays.length || arrays.length === 1) return arrays;
    var mid = arrays[arrays.length >> 1];
    var left = [], right = [], middle=[];
    for (var i = 0; i < arrays.length; i++) {
      if (arrays[i] === mid) {
        middle.push(arrays[i]);
      } else if (arrays[i] < mid) {
        left.push(arrays[i]);
      } else  {
        right.push(arrays[i]);
      }
    }
    return quickSort(left).concat(middle).concat(quickSort(right));
  };

  nums = quickSort(nums);

  return nums[nums.length - k];
};
// @lc code=end

