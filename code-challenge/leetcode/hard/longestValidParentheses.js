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

/* *************** 解法1 *************** */

/**
 * @param {string} s
 * @return {number}
 */
var longestValidParentheses = function(s) {
  var matchArray = [];
  var done = false;
  var i = 0;
  var maxLength = 0;

  /* 获取所有()的位置索引 */
  for (i; i < s.length - 1; i++) {
    if (s[i] === '(' && s[i + 1] === ')') {
      matchArray.push([i, i + 1]);
      i++;
    }
  }
  
  /* 合并相邻数组 */
  var doConcat = function() {
    var find = false;
    for (i = 0; i < matchArray.length - 1; i++) {
      if (matchArray[i][matchArray[i].length - 1] + 1 === matchArray[i + 1][0]) {
        find = true;
        matchArray[i] = matchArray[i].concat(matchArray[i + 1]);
        matchArray.splice(i + 1, 1);
        i--;
      }
    }
    if (find) doConcat();
  };

  while(!done) {
    doConcat();
    done = true;
    matchArray.map(function(item) {
      // 经匹配括号从内至外扩张合并新的括号
      if (s[item[0] - 1] === '(' && s[item[item.length - 1] + 1] === ')') {
        item.unshift(item[0] - 1);
        item.push(item[item.length - 1] + 1);
        done = false;
      }
    });
  }

  matchArray.find(function(item) {
    if (item.length > maxLength) maxLength = item.length;
    return false;
  });

  return maxLength;
};

/* *************** 解法2 *************** */
/**
 * @param {string} s
 * @return {number}
 */
longestValidParentheses = function(s) {
  var indexArray = [-1]; //动态存储左括号索引值-1，
  var maxLength = 0;
  var stack = []; // 栈存储已经遍历的左括号索引
  var i = 0;

  for (i; i < s.length; i++) {
    if (s[i] === '(') {
      stack.push(i);
    } else {
      if (stack.length) {
        // 括号匹配的情况从栈顶弹出
        tmp = stack.pop();
        // 每次栈顶弹出时，索引数组同步弹出(至少保留第一个索引)
        if (indexArray.length > 1) indexArray.pop();
        // 栈不为空，则将栈顶索引存入一个索引数组以便之后回溯计算最大字符串长度
        if (stack.length) indexArray.push(stack[stack.length - 1]);
        maxLength = Math.max(maxLength, i - indexArray[indexArray.length - 1]);
      } else {
        // 首个匹配到的字符为')'的情况，重置索引数组首项
        indexArray = [i];
      }
    }
  }

  return maxLength;
};

// console.log(longestValidParentheses(')()())'));
console.log(longestValidParentheses('()(())'));
// console.log(longestValidParentheses("(()())"));
// console.log(longestValidParentheses(")()())()()("))
// console.log(longestValidParentheses(")(((((()())()()))()(()))("));
// console.log(longestValidParentheses(")(((())))))("));
// console.log(longestValidParentheses(")(())))(())())"))

") ( ( ( ( ( ( ) ( ) ) ( ) ( ) ) ) ( ) ( ( ) ) ) ( "
"0 1 2 3 4 5 6 7 8 9 X 1 2 3 4 5 6 7 8 9 X 1 2 3 4"

") ( ( ( ( ) ) ) ) ) ) ( "
"0 1 2 3 4 5 6 7 8 9 X 1 "
