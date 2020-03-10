/* -----------------------------------------------------------------------------
  给定字符串 str，检查其是否以元音字母结尾
  1、元音字母包括 a，e，i，o，u，以及对应的大写
  2、包含返回 true，否则返回 false
----------------------------------------------------------------------------- */

function endsWithVowel(str) {
  if(/[aeiou]$/i.test(str))
    return true;
  else
    return false;
}

console.log(endsWithVowel('sdddd'));
