/*
 * @lc app=leetcode.cn id=66 lang=javascript
 *
 * [66] 加一
 */

// @lc code=start
/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function(digits, index = 0) {
  var symbol = 0;
  
  if (index === digits.length) return 1;
  
  symbol = plusOne(digits, index + 1);
  digits[index] += symbol;

  if (digits[index] === 10) {
    digits[index] = 0;
    symbol = 1;
  } else {
    symbol = 0;
  }

  if (index === 0) {
    if (symbol === 1) digits.unshift(1);
    return digits;
  } else {
    return symbol;
  }

};
// @lc code=end