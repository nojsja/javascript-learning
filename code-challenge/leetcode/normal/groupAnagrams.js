/**
49. 字母异位词分组
中等
相关标签
premium lock icon
相关企业
给你一个字符串数组，请你将 字母异位词 组合在一起。可以按任意顺序返回结果列表。

示例 1:

输入: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]

输出: [["bat"],["nat","tan"],["ate","eat","tea"]]

解释：

在 strs 中没有字符串可以通过重新排列来形成 "bat"。
字符串 "nat" 和 "tan" 是字母异位词，因为它们可以重新排列以形成彼此。
字符串 "ate" ，"eat" 和 "tea" 是字母异位词，因为它们可以重新排列以形成彼此。
示例 2:

输入: strs = [""]

输出: [[""]]

示例 3:

输入: strs = ["a"]

输出: [["a"]]

提示：

1 <= strs.length <= 104
0 <= strs[i].length <= 100
strs[i] 仅包含小写字母
 */

/**
 * @param {string[]} strs
 * @return {string[][]}
 */
const groupAnagrams = function(strs) {
  const strsArray = strs.map((str, index) => {
    return {
      value: str.split('').sort().join(''),
      index,
    };
  }).sort((a, b) => a.value.toLowerCase().localeCompare(b.value.toLowerCase()));
  const newArray = [];
  let i = 0, j = 0;

  while ((i < strsArray.length) && (j < strsArray.length)) {
    j = i + 1;
    newArray[i] = [strs[strsArray[i].index]];

    while(j < strsArray.length) {
      if (strsArray[j].value === strsArray[i].value) {
        newArray[i].push(strs[strsArray[j].index]);
        j++;
      } else {
        break;
      }
    }
    i = j;
  }

  return newArray.filter(Boolean);
};

console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));
console.log(groupAnagrams([""]));
console.log(groupAnagrams(["a"]));
console.log(groupAnagrams([]));