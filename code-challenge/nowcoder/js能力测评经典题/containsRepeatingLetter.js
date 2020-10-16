/* -----------------------------------------------------------------------------
  给定字符串 str，检查其是否包含连续重复的字母（a-zA-Z），包含返回 true，否则返回 false
----------------------------------------------------------------------------- */
function containsRepeatingLetter(str) {
  if (/([a-zA-Z])\1/.test(str)) {
    return true;
  }else {
    return false;
  }
}

console.log(containsRepeatingLetter('sss'));
