/* -------------------------------------------------------
  description:
  给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。

  给出数字到字母的映射如下（与电话按键相同）。注意 1 不对应任何字母。

  示例 1：

  输入：digits = "23"
  输出：["ad","ae","af","bd","be","bf","cd","ce","cf"]
  示例 2：

  输入：digits = ""
  输出：[]
  示例 3：

  输入：digits = "2"
  输出：["a","b","c"]

  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/letter-combinations-of-a-phone-number
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */

/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function(digits) {
  var i = 'a'.charCodeAt();
  var tmp, res = [];
  digits = digits.split('');
  if (!digits.length) return [];

  /* 根据ascii码获取数字对应的字母 */
  var codeArray = digits.map(function(dg) {
    if (dg == 7 || dg == 9) {
      tmp = (dg == 7 ? 'p' : 'w').charCodeAt();
      return String.fromCharCode(tmp, tmp+1, tmp+2, tmp+3);  
    }
    if (dg == 8) tmp = 't'.charCodeAt();
    tmp = i + ((+dg) - 2) * 3;
    return String.fromCharCode(tmp, tmp+1, tmp+2);
  });

  /* 回溯算法 */
  var backtrack = function(strArray, s) {
    if (!strArray.length) return res.push(s);

    var tmp2 = strArray.shift();
    for (var n = 0; n < tmp2.length; n++) {
      backtrack(strArray, s+tmp2[n]);
    }

    strArray.unshift(tmp2);
  }

  backtrack(codeArray, '');

  return res;
};

letterCombinations('7');