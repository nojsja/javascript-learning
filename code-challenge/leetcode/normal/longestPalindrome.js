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
function longestPalindrome(string) {
  const length = string.length;
  let maxStr = string[0];
  let i = 0, j, k;

  while (i < length) {
    k = i;
    j = i+1;
    if (string[k] !== string[j]) {
      k = i - 1;
    }
    while (k >= 0 && j < length) {
      if (string[k] === string[j]) {
        const tmpLength = j - k + 1;
        maxStr = tmpLength > maxStr.length ? string.slice(k, j + 1) : maxStr;
        k--;
        j++;
      } else {
        break;
      }
    }
    i++;
  }

  return maxStr;
}

console.log(longestPalindrome("tattarrattat"));
console.log(longestPalindrome("d"));
console.log(longestPalindrome("dd"));
console.log(longestPalindrome("ddd"));
console.log(longestPalindrome("dddd"));
console.log(longestPalindrome("adbdac"));
