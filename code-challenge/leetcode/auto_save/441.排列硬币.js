/*
 * @lc app=leetcode.cn id=441 lang=javascript
 *
 * [441] 排列硬币
 */

// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var arrangeCoins = function(n) {
  var count = 0;

  while (n - count > 0) {
    count ++;
    n -= count;
  }

  return count;
};
// @lc code=end

