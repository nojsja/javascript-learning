/*
 * @lc app=leetcode.cn id=3 lang=javascript
 *
 * [3] 无重复字符的最长子串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring2 = function(s) {
  var pre, max = 1;
  if (s.length <= 1) return s.length;

  for (var i = 0; i < s.length - 1; i++) {
    pre = s[i];
    for (var j = i + 1; j < s.length; j++) {
      if (!pre.includes(s[j])) {
        pre += s[j];
      } else {
        break;
      }
    }
    max = Math.max(max, pre.length);
  }

  return max;
};
/**
 * @param {string} s
 * @return {number}
 */
 var lengthOfLongestSubstring = function(s) {
  var pre = 0, next = 1, max = 1, str = s[pre];
  if (s.length <= 1) return s.length;

  while (s[pre] && s[next]) {
    if (!str.includes(s[next])) {
      str += s[next]
      max = Math.max(max, next - pre + 1);
      next ++;
    } else {
      pre ++;
      next = pre + 1;
      str = s[pre];
    }
  }

  return max;
};
// @lc code=end

