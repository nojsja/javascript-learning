/* -----------------------------------------------------------------------------
  给定字符串 str，检查其是否包含 连续3个数字
  1、如果包含，返回最新出现的 3 个数字的字符串
  2、如果不包含，返回 false
----------------------------------------------------------------------------- */
function captureThreeNumbers(str) {
  console.log(/( ([\d])\1 ){3}/.match(str));
  if( /( ([\d])\1 ){3}/.test(str) ) {
    return true;
  }else {
    return false;
  }
}

console.log(captureThreeNumbers('333sdkfj'));
