/*
 * @lc app=leetcode.cn id=263 lang=javascript
 *
 * [263] 丑数
 */

// @lc code=start
/**
 * @param {number} n
 * @return {boolean}
 */
var isUgly = function(n) {
  if (n === 0) return false;
  if (n === 1) return true;
  
  var validNum = [2, 3, 5];
  for (var i = 0; i < validNum.length; i++) {
    while(n % validNum[i] === 0) {
      n /= validNum[i];
    }
  }

  return n === 1;
};
// @lc code=end

