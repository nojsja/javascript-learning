/*
 * @lc app=leetcode.cn id=605 lang=javascript
 *
 * [605] 种花问题
 */

// @lc code=start
/**
 * @param {number[]} flowerbed
 * @param {number} n
 * @return {boolean}
 */
var canPlaceFlowers = function(flowerbed, n) {
  var length = flowerbed.length;
  for (var i = 0; i < length; i++) {
    if (!flowerbed[i] && !flowerbed[i+1] && !flowerbed[i-1]) {
      n--;
      flowerbed[i] = 1;
    }
  }

  return n <= 0;
};
// @lc code=end