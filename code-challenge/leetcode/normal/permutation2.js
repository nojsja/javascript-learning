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
const permutation = function(S) {
    const results = [];

    const backtrace = function(preStr, str) {
        if (str.length === 1) {
            if (!results.includes(`${preStr}${str}`)) {
                results.push(`${preStr}${str}`);
            }
        } else {
            for (let i = 0; i < str.length; i++) {
                backtrace(`${preStr}${str[i]}`, str.slice(0, i)+str.slice(i+1));
            }
        }
    };

    if (!S) {
      return [''];
    }

    backtrace('', S);

    return results;
};

console.log(permutation("qqe"));