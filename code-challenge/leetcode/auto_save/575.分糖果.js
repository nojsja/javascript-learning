/*
 * @lc app=leetcode.cn id=575 lang=javascript
 *
 * [575] 分糖果
 */

// @lc code=start
/**
 * @param {number[]} candyType
 * @return {number}
 */
var distributeCandies = function(candyType) {
  var count = 0;
  var length = candyType.length;
  var len = length / 2;
  var pre, index = 0;

  candyType.sort((a, b) => a - b);

  while(index < length) {
    if (pre !== candyType[index]) {
      count ++;
      if (count === len) break;
      pre = candyType[index];
    }
    index ++;
  }

  return count;
};
// @lc code=end

