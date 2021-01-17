/* -------------------------------------------------------
  description:
  编写一个函数来查找字符串数组中的最长公共前缀。

  如果不存在公共前缀，返回空字符串 ""。

   

  示例 1：

  输入：strs = ["flower","flow","flight"]
  输出："fl"
  示例 2：

  输入：strs = ["dog","racecar","car"]
  输出：""
  解释：输入不存在公共前缀。

  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/longest-common-prefix
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */

/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
  if (strs.length < 2) return strs[0] || '';
  var s = '', tmp;
  for (var i = 0; i < strs[0].length; i++) {
    tmp = strs[0].substring(0, i+1);
    for (var j = 1; j < strs.length; j++) {
      if (strs[j].indexOf(tmp) !== 0) break;
    }
    if (j === strs.length) s = tmp;
  }

  return s;
};