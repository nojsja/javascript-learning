/* -------------------------------------------------------
  description:
  有重复字符串的排列组合。编写一种方法，计算某字符串的所有排列组合。

  示例1:

  输入：S = "qqe"
  输出：["eqq","qeq","qqe"]

  示例2:

  输入：S = "ab"
  输出：["ab", "ba"]

  提示:

      字符都是英文字母。
      字符串长度在[1, 9]之间。
------------------------------------------------------- */

/**
 * @param {string} S
 * @return {string[]}
 */
var permutation = function(S) {
  var strArray = S.split('').sort();
  var filtedArray = [];

  var rollCheck = function(pushed = [], target = []) {
    if (!target.length) return filtedArray.push(pushed.join(''));
    for (var i = 0; i < target.length; i++) {
      if (target[i] === target[i - 1]) continue;
      pushed.push(target[i]);
      rollCheck(pushed, target.filter((_, index) => index !== i ));
      pushed.pop();
    }
  };

  rollCheck([], strArray);

  return filtedArray;
};
console.log(permutation("qqe"));