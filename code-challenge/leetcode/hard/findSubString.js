/* -------------------------------------------------------
  description:
  给定一个字符串 s 和一些长度相同的单词 words。找出 s 中恰好可以由 words 中所有单词串联形成的子串的起始位置。

  注意子串要与 words 中的单词完全匹配，中间不能有其他字符，但不需要考虑 words 中单词串联的顺序。

  示例 1：

  输入：
    s = "barfoothefoobarman",
    words = ["foo","bar"]
  输出：[0,9]
  解释：
  从索引 0 和 9 开始的子串分别是 "barfoo" 和 "foobar" 。
  输出的顺序不重要, [9,0] 也是有效答案。
  示例 2：

  输入：
    s = "wordgoodgoodgoodbestword",
    words = ["word","good","best","word"]
  输出：[]

------------------------------------------------------- */

/**
 * @param {string} s
 * @param {string[]} words
 * @return {number[]}
 */
var findSubstring = function(s, words) {
  var iArray = [], // 所有符合要求的索引
    words2 = words.slice(), // 原始目标数组的拷贝
    start = 0, // 起始索引
    length = s.length, // 字符串总长度
    wlength = words[0].length, // 目标数组元素长度
    index,
    end = wlength; // 结束索引

  if (s.length < words.join('').length) return [];

  while (end <= length) {
    index = words2.indexOf(s.substring(start, end));
    if (index === -1) {
      if (words2.length !== words.length) {
        // start -= wlength * (words.length - words2.length - 1);
        // end -= wlength * (words.length - words2.length - 1);
        start = end - (words.length - words2.length + 1) * wlength + 1;
        end = start + wlength;
        words2 = words.slice()
      } else {
        start += 1;
        end += 1;
      }
    } else {
      words2.splice(index, 1);
      if (!words2.length) {
        iArray.push(end - words.length * wlength);
        words2 = words.slice();
        // start -= wlength * (words.length - 2);
        // end -= wlength * (words.length - 2);
        start = end - words.length * wlength + 1;
        end = start + wlength;
      } else {
        start += wlength;
        end += wlength;
      }

    }
  }

  return iArray;
};

// console.log(findSubstring('barfoothefoobarman', ["foo","bar"]));
// console.log(findSubstring("barfoofoobarthefoobarman", ["bar","foo","the"]));
// console.log(findSubstring("wordgoodgoodgoodbestword", ["word","good","best","good"]));
// console.log(findSubstring("aaaaaaaaaaaaaa", ["aa","aa"]));
console.log(findSubstring("ababaab", ["ab","ba","ba"]));
