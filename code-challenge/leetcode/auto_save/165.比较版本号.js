/*
 * @lc app=leetcode.cn id=165 lang=javascript
 *
 * [165] 比较版本号
 */

// @lc code=start
/**
 * @param {string} version1
 * @param {string} version2
 * @return {number}
 */
var compareVersion = function(version1, version2) {
  var v1s = version1.split('.');
  var v2s = version2.split('.');

  while (v1s.length || v2s.length) {
    let tmp1 = +(v1s.shift() || 0);
    let tmp2 = +(v2s.shift() || 0);
    if (tmp1 > tmp2) {
      return 1;
    }
    if (tmp1 < tmp2) {
      return -1;
    }
  }

  return 0;
};
// @lc code=end

