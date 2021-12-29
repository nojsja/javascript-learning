/*
 * @lc app=leetcode.cn id=46 lang=javascript
 *
 * [46] 全排列
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function(nums) {
  var results = [];

  var cal = function(array, total) {
    if (array.length === total.length)
      return results.push([...total]);
    for (var i = 0; i < array.length; i++) {
      var tmp = array[i];
      if (total.includes(tmp)) continue;
      total.push(tmp);
      cal(array, total);
      total.pop();
    }
  }

  cal(nums, []);

  return results;
};
// @lc code=end

