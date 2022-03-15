/*
 * @lc app=leetcode.cn id=504 lang=javascript
 *
 * [504] 七进制数
 */

// @lc code=start
/**
 * @param {number} num
 * @return {string}
 */
var convertToBase7 = function(num) {
  var numStr = '';
  var symbol = '';

  if (num === 0) return String(num);
  if (num < 0) {
    symbol = '-';
    num = Math.abs(num);
  };

  while (num >= 1) {
    numStr = (num % 7) + numStr;
    num = parseInt(num / 7, 10);
  }

  return symbol + numStr;
};
// @lc code=end

