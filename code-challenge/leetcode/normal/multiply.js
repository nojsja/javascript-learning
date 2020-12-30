/* -------------------------------------------------------
  description:

  给定两个以字符串形式表示的非负整数 num1 和 num2，返回 num1 和 num2 的乘积，它们的乘积也表示为字符串形式。

  示例 1:

  输入: num1 = "2", num2 = "3"
  输出: "6"
  示例 2:

  输入: num1 = "123", num2 = "456"
  输出: "56088"
  说明：

  num1 和 num2 的长度小于110。
  num1 和 num2 只包含数字 0-9。
  num1 和 num2 均不以零开头，除非是数字 0 本身。
  不能使用任何标准库的大数类型（比如 BigInteger）或直接将输入转换为整数来处理。

  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/multiply-strings
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */

/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var multiply = function(num1, num2) {
  var res = 0n;
  var tmp;
  var i = 0, j = 0;

  while(i < num1.length) {
    j = 0;
    tmp = BigInt(Math.pow(10, i)) * BigInt(num1[num1.length - i - 1]);
    while(j < num2.length) {
      res += BigInt(num2[num2.length-j-1]) * BigInt(Math.pow(10, j)) * tmp;
      j++;
    }
    i++;
  }

  return BigInt.prototype.toString.call(res);
};

var multiply = (num1, num2) => {
  var len1 = num1.length;
  var len2 = num2.length;
  var pos = new Array(len1 + len2).fill(0);

  for (var i = len1 - 1; i >= 0; i--) {
    var n1 = +num1[i];
    for (var j = len2 - 1; j >= 0; j--) {
      var n2 = +num2[j];
      var multi = n1 * n2;
      var sum = pos[i + j + 1] + multi;

      pos[i + j + 1] = sum % 10;
      pos[i + j] += sum / 10 | 0;
    }
  }
  var resStr = pos.join('');
  while (resStr[0] == '0') {
    resStr = resStr.substring(1);
  }
  return resStr.length ? resStr : '0';
};

console.log(multiply("401716832807512840963", "167141802233061013023557397451289113296441069"))