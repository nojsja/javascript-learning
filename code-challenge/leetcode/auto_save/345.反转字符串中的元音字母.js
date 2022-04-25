/*
 * @lc app=leetcode.cn id=345 lang=javascript
 *
 * [345] 反转字符串中的元音字母
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var reverseVowels = function(s) {
  var array = Array.from(s);
  var left = 0, right = s.length - 1;
  var checkStrs = ['a', 'e', 'i', 'o', 'u'];
  var tmp;

  while (left < right) {
    var leftCheck = checkStrs.includes(array[left].toLowerCase());
    var rightCheck = checkStrs.includes(array[right].toLowerCase());
    if (leftCheck && rightCheck) {
      tmp = array[left];
      array[left] = array[right];
      array[right] = tmp;
      left ++;
      right --;
      continue;
    }
    if (!leftCheck) {
      left ++;
    }
    if (!rightCheck) {
      right --;
    }
  }

  return array.join('');
};
// @lc code=end

