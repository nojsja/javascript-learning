/*
 * @lc app=leetcode.cn id=455 lang=javascript
 *
 * [455] 分发饼干
 */

// @lc code=start
/**
 * @param {number[]} g
 * @param {number[]} s
 * @return {number}
 */
var findContentChildren = function(g, s) {
  var count = 0;
  var sindex = 0, gindex = 0;
  var glen = g.length, slen = s.length;

  g = g.sort((a, b) => a - b);
  s = s.sort((a, b) => a - b);

  while(sindex < slen && gindex < glen) {
    if (s[sindex] >= g[gindex]) {
      count ++;
      sindex ++;
      gindex ++;
    } else {
      sindex ++;
    }
  }

  return count;
};
// @lc code=end


// @after-stub-for-debug-begin
module.exports = findContentChildren;
// @after-stub-for-debug-end