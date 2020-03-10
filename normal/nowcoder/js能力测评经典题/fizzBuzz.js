/* -----------------------------------------------------------------------------
  实现 fizzBuzz 函数，参数 num 与返回值的关系如下：
  1、如果 num 能同时被 3 和 5 整除，返回字符串 fizzbuzz
  2、如果 num 能被 3 整除，返回字符串 fizz
  3、如果 num 能被 5 整除，返回字符串 buzz
  4、如果参数为空或者不是 Number 类型，返回 false
  5、其余情况，返回参数 num
----------------------------------------------------------------------------- */
function fizzBuzz(num) {

  if (num == undefined || typeof num != 'number') {
    return false;
  }

  if (num % 3 == 0 && num % 5 == 0) {
    return 'fizzbuzz';
  }

  if (num % 3 == 0) {
    return 'fizz';
  }

  if (num % 5 == 0) {
    return 'buzz';
  }

  return num;
}

console.log(fizzBuzz(5));
