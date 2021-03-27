/* -------------------------------------------------------
  description:
  给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。

  有效字符串需满足：

  左括号必须用相同类型的右括号闭合。
  左括号必须以正确的顺序闭合。
  注意空字符串可被认为是有效字符串。

  示例 1:

  输入: "()"
  输出: true
  示例 2:

  输入: "()[]{}"
  输出: true
  示例 3:

  输入: "(]"
  输出: false
  示例 4:

  输入: "([)]"
  输出: false
  示例 5:

  输入: "{[]}"
  输出: true

  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/valid-parentheses
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */

/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
  var leftBrackets = ['(', '[', '{'];
  var rightBrackets = [')', ']', '}'];
  var stack = [], i=0, bool = true, index;

  while (i < s.length && bool) {
    if (leftBrackets.includes(s[i])) {
      stack.push(s[i])
    } else {
      index = rightBrackets.indexOf(s[i]);
      bool = (leftBrackets[index] === stack.pop());
    }
    i++;
  }

  bool = bool && !(stack.length);

  return bool;
};

var isValid = function(s) {
  var stack = [];
  var map = {
    "[": "]",
    "{": "}",
    "(": ")",
  };

  for (var i = 0; i < s.length; i++) {
    if (map[s[i]]) {
      stack.push(s[i]);
    } else {
      if (map[stack.pop()] !== s[i])
        return false;
    }
  }

  return !stack.length;
}

console.log(isValid("()[]{}"));
console.log(isValid("([)]"));