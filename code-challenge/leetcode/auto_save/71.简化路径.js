/*
 * @lc app=leetcode.cn id=71 lang=javascript
 *
 * [71] 简化路径
 */

// @lc code=start
/**
 * @param {string} path
 * @return {string}
 */
var simplifyPath = function(path) {
  var pathItems = path.split('/');

  for (var i = 0; i < pathItems.length;) {
    if (pathItems[i] === '.' || pathItems[i] === '') {
      pathItems.splice(i, 1);
    } else if (pathItems[i] === '..') {
      if (i - 1 >= 0) {
        pathItems.splice(i - 1, 2);
      } else {
        pathItems.splice(0, 1);
      }
      i -= 1;
    } else {
      i ++;
    }
  }

  return `/${pathItems.join('/')}`;
};
// @lc code=end

