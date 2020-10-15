/* -------------------------------------------------------
  description:
  给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。
  示例 1:

  输入: "abcabcbb"
  输出: 3 
  解释: 因为无重复字符的最长子串是 "abc"，所以其长度为 3。

  示例 2:

  输入: "bbbbb"
  输出: 1
  解释: 因为无重复字符的最长子串是 "b"，所以其长度为 1。

  示例 3:

  输入: "pwwkew"
  输出: 3
  解释: 因为无重复字符的最长子串是 "wke"，所以其长度为 3。
      请注意，你的答案必须是 子串 的长度，"pwke" 是一个子序列，不是子串。

------------------------------------------------------- */

/* *************** 解法1 *************** */

/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
  var length = s.length;
  var str = s[0], str2;
  var i = 1, j;
  if (s.length <= 1) return s.length;

  for (i; i < length; i++) {
      str2 = s[i];
      for (j = i - 1; j >= 0; j--) {
          if (!str2.includes(s[j])) {
              str2 = s[j] + str2;
          } else {
            break;
          }
      }
      str = str2.length >= str.length ? str2 : str;
  }

  return str.length;
};

/* *************** 解法2 *************** */

lengthOfLongestSubstring = function(s) {
  var length = s.length;
  var start = 0, end = 1, max = 1;
  var str2 = s[0];
  if (s.length <= 1) return s.length;
  while (end < length) {
    if (str2.includes(s[end])) {
      start = s.lastIndexOf(s[end], end - 1) + 1;
    }
    end += 1;
    str2 = s.substring(start, end);
    console.log(start, end, str2);
    max = Math.max(max, str2.length);
  }
  
  return max;
};

console.log(lengthOfLongestSubstring("abcabcbb"));
