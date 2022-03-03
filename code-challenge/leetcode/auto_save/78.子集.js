/*
 * @lc app=leetcode.cn id=78 lang=javascript
 *
 * [78] 子集
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function(nums) {
  var res = [[]];
  
  var loop = function(array, pre, index) {
    for (var i = index; i < array.length; i++) {
      var tmp = array[i];
      pre.push(tmp);
      res.push(pre.slice());
      loop(array, pre, i + 1);
      pre.pop();
    }
  };
  
  loop(nums, [], 0);
  
  return res;
};
// @lc code=end