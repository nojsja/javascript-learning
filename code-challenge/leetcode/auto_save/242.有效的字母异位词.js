/*
 * @lc app=leetcode.cn id=242 lang=javascript
 *
 * [242] 有效的字母异位词
 */

// @lc code=start
/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function(s, t) {
  var map = {};
  var len1 = s.length;
  var len2 = t.length;

  if (len1 !== len2) return false;

  for (var i = 0; i < len1; i++) {
    map[s[i]] = (map[s[i]] === undefined) ? 1 : (map[s[i]] + 1);
  }
  for (var i = 0; i < len1; i++) {
    if (!map[t[i]]) return false;
    map[t[i]] -= 1;
  }
  for (var attr in map) {
    if (map[attr] !== 0) return false;
  }
  return true;
};
// @lc code=end

