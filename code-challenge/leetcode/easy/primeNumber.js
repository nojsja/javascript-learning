/* -------------------------------------------------------
  description:
  功能:输入一个正整数，按照从小到大的顺序输出它的所有质因子（如180的质因子为2 2 3 3 5 ）
  最后一个数后面也要有空格。

  1. 输入的整数 n，对最小的一个质数 i=2 求余。
  2. 如果得到余数为 0，重复执行 1。
  3. 如果得到的商不为 0，i++，执行 1，2。
  4. 终止条件为 n /= i == i，也就是 n 除以质数后的值等 i 这个质因子。
------------------------------------------------------- */

function getPrimeNumber(number) {
  var res = [];
  var i = 2, k = Math.sqrt(number);

  while (number !== i && i <= k) {
    while((number % i) === 0) {
      res.push(i);
      number = number / i;
    }
    i++;
  }

  if (number > 1) res.push(number);

  console.log(res.join(' '));
  return res;
}

getPrimeNumber(180);