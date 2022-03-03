/*
 * @lc app=leetcode.cn id=40 lang=javascript
 *
 * [40] 组合总和 II
 */

// @lc code=start
/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum2 = function(candidates, target) {
  var res = [];
  var check = {};
  candidates = candidates.sort((a, b) => (a - b));

  var backtrace = function(array, sum, list, i) {
    for (i; i < array.length; i++) {
      var tmp = array[i];
      if (tmp > sum || (!check[tmp] && array[i] === array[i - 1])) continue;
      if (tmp === sum) {
        res.push(list.concat(tmp));
      }
      check[tmp] = true;
      backtrace(array, sum - tmp, list.concat(tmp), i + 1);
      delete check[tmp];
    }
  };

  backtrace(candidates, target, [], 0);

  return res;
};
// @lc code=end

