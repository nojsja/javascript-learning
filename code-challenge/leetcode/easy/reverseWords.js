/* -------------------------------------------------------
  description:
  给定一个字符串，你需要反转字符串中每个单词的字符顺序，同时仍保留空格和单词的初始顺序。

   

  示例：

  输入："Let's take LeetCode contest"
  输出："s'teL ekat edoCteeL tsetnoc"
   

  提示：

  在字符串中，每个单词由单个空格分隔，并且字符串中不会有任何额外的空格。


  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/reverse-words-in-a-string-iii
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */
/**
 * @param {string} s
 * @return {string}
 */
var reverseWords = function(s) {
  var start=0, end = s.indexOf(' '), tmp, t=false;

  if (end === -1) end = s.length;

  s = s.split('');

  for (var i = 0; i < s.length; i++) {
    if ( i < (start + (Math.floor((end - start) / 2))) ) {
      tmp = s[i];
      s[i] = s[end-1-(i - start)];
      s[end-1-(i - start)] = tmp;
    } else {
      i = end;
      start = i + 1;
      end = s.indexOf(' ', end + 1) || s.length;
      
      if (!t && end === -1) {
        t = true;
        end = s.length;
      }
    }
  }

  return s.join('');
};

var reverseWords = function(s) {
  var start=0, tmp = '';

  s = s.split(' ');

  while(start < s.length) {
    for (var i = 0; i < s[start].length; i++) {
      tmp += s[start][s[start].length - 1 - i];
    }
    start ++;
    if (start < s.length) tmp += ' ';
  }

  return tmp;
};


console.log(reverseWords("Let's take LeetCode contest"));
console.log(reverseWords("LeetCode contest"));
console.log(reverseWords("LeetCode"));
console.log(reverseWords(""));