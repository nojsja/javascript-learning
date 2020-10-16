/* -----------------------------------------------------------------------------
  给定字符串 str，检查其是否包含数字，包含返回 true，否则返回 false
----------------------------------------------------------------------------- */
function containsNumber(str) {
  if (/[\d+]/.test(str)) {
    return true;
  }else {
    return false;
  }
}

console.log(containsNumber('dsf00'));
