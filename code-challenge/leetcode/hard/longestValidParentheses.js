/* -------------------------------------------------------
  description:
  给定一个只包含 '(' 和 ')' 的字符串，找出最长的包含有效括号的子串的长度。

  示例 1:

  输入: "(()"
  输出: 2
  解释: 最长有效括号子串为 "()"

  示例 2:

  输入: ")()())"
  输出: 4
  解释: 最长有效括号子串为 "()()"

------------------------------------------------------- */

/**
 * @param {string} s
 * @return {number}
 */
var longestValidParentheses = function(s) {
  var matchArray = [],
    tmp,
    done = false,
    i = 0;

  /* 获取所有()的位置索引 */
  for (i; i < s.length - 1; i++) {
    if (s[i] === '(' && s[i + 1] === ')') {
      matchArray.push([i, i + 1]);
      i++;
    }
  }
  
  /* 合并相邻数组 */
  var doConcat = function() {
    for (i = 0; i < matchArray.length - 1; i++) {
      if (matchArray[i][matchArray[i].length - 1] + 1 === matchArray[i + 1][0]) {
        matchArray[i] = matchArray[i].concat(matchArray[i + 1]);
        matchArray.splice(i + 1, 1);
        i--;
      }
    }
    if (matchArray.some(function(item, index) {
      return matchArray[index + 1] ?  (item[item.length - 1] + 1 === matchArray[index + 1][0]) : false;
    })) {
      doConcat();
    }
  };

  while(!done) {
    doConcat();
    tmp = matchArray.map(function(item) {
      // 经匹配括号从内至外扩张合并新的括号
      if (s[item[0] - 1] === '(' && s[item[item.length - 1] + 1] === ')') {
        item.unshift(item[0] - 1);
        item.push(item[item.length - 1] + 1);
        return false
      } else {
        return true;
      }
    });
    done = tmp.every(function(isDone) { return isDone; });
  }

  return matchArray.length ? matchArray.sort(function(a, b) {
    return a.length - b.length
  })[matchArray.length - 1].length : 0;
  
};

// console.log(longestValidParentheses(')()())'));
// console.log(longestValidParentheses('()(())'));
// console.log(longestValidParentheses("(()())"));
// console.log(longestValidParentheses(")()())()()("))
// console.log(longestValidParentheses(")(((((()())()()))()(()))("));
console.log(longestValidParentheses(")(((())))))("));
