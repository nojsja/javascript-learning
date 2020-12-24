/* -------------------------------------------------------
  description:
  给定一个字符串 s，找到 s 中最长的回文子串。你可以假设 s 的最大长度为 1000。

  示例 1：

  输入: "babad"
  输出: "bab"
  注意: "aba" 也是一个有效答案。

  示例 2：

  输入: "cbbd"
  输出: "bb"

  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/longest-palindromic-substring
------------------------------------------------------- */

/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
  if (!s || s.length < 1) return '';
  var len = s.length;
  var start = 0, max="", pre, next, bool;

  while(start < len) {

    tmp = s[start];
    pre = next = start;
    bool = true;

    while(true) {
      if (bool) {
        if (s[pre-1] === s[start]) {
          pre -= 1;
        } else if (s[next+1] === s[start]) {
          next += 1;  
        } else {
          bool = false;
        }
      } else {
        if (!s[pre] || !s[next] || s[pre] !== s[next]) break;
        bool = false;
        pre -= 1;
        next += 1;
      }
    }

    if (pre !== next) tmp = s.slice(pre+1, next);
    max = (tmp.length > max.length) ? tmp : max;
    start++;
  }

  return max;
}

console.log(longestPalindrome("tattarrattat"));
console.log(longestPalindrome("d"));
console.log(longestPalindrome("dd"));
console.log(longestPalindrome("ddd"));
console.log(longestPalindrome("dddd"));
console.log(longestPalindrome("adbdac"));
