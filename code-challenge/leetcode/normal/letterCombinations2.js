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
function letterCombinations(digits) {
  const results = [];
  const digitsNumber = digits.split('').reduce((pre, next) => {

    switch (next) {
      case '7':
        pre.push(['p', 'q', 'r', 's']);
        break;
      case '8':
        pre.push(['t', 'u', 'v']);
        break;
      case '9':
        pre.push(['w','x','y','z']);
        break;
      default:
        const wordAtNextInAscii = next.charCodeAt(0);
        const wordAt2InAscii = '2'.charCodeAt(0);
        const wordForAInAscii = 'a'.charCodeAt(0);
        const numberGap = wordAtNextInAscii - wordAt2InAscii;
    
        pre.push([
          String.fromCharCode(wordForAInAscii + (numberGap * 3)),
          String.fromCharCode(wordForAInAscii + 1 + (numberGap * 3)),
          String.fromCharCode(wordForAInAscii + 2 + (numberGap * 3))
        ]);
        break;
    }

    return pre;

  }, []);

  const findResultInNumberArray = function(currentStr, index) {
    const currentItem = digitsNumber[index];
    let newStr = currentStr;

    for (let i = 0; i < currentItem.length; i++) {
      newStr = currentStr + currentItem[i];
      if (index === digitsNumber.length - 1) {
        results.push(newStr);
      } else {
        findResultInNumberArray(newStr, index + 1);
      }
    }
  }

  if (!digits.length) {
    return results;
  }

  findResultInNumberArray('', 0);

  return results;
};

const result = letterCombinations('7');

console.log(result);