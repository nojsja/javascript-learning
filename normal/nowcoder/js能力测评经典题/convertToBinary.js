/* -----------------------------------------------------------------------------
  将给定数字转换成二进制字符串。如果字符串长度不足 8 位，则在前面补 0 到满8位。
----------------------------------------------------------------------------- */
function convertToBinary(num) {
  var array = num.toString(2).split('');
  var array2 = [];
  for(var i = 0; i < 8; i++){
    if (!array[i])
      array2.push(0);
  }
  return array2.concat(array).join('');
}

console.log(convertToBinary(65));
