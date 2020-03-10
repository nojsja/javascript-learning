/* -----------------------------------------------------------------------------
  求 a 和 b 相乘的值，a 和 b 可能是小数，需要注意结果的精度问题
----------------------------------------------------------------------------- */

function multiply(a, b) {
  var length = (a).toString().split('.')[1] && (a).toString().split('.')[1].length
    || (b).toString().split('.')[1] && (b).toString().split('.')[1].length || 0;

  return Number(a * b).toFixed(length);
}

console.log(multiply(3, 0.0001));
