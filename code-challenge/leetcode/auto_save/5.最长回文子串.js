/*
 * @lc app=leetcode.cn id=5 lang=javascript
 *
 * [5] 最长回文子串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(str) {
  let i = 0, length = str.length, max = str[0];
  let pre, next;

  function getMax(p, n) {
      while (p >= 0 && n < length) {
          if (str[p] === str[n]) {
            if (n - p + 1 > max.length)
              max = str.substring(p, n+1);
          } else {
              break;
          }
          n += 1;
          p -= 1;
      }
  }

  while (i < length - 1) {
      // 奇数
      pre = next = i;
      getMax(pre, next);
      // 偶数
      pre = i, next = i + 1;
      getMax(pre, next);
      i++;
  }

  return max;
};
// @lc code=end

