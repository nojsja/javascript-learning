/* -------------------------------------------------------
  description:
  给定一个已按照 升序排列  的整数数组 numbers ，请你从数组中找出两个数满足相加之和等于目标数 target 。

  函数应该以长度为 2 的整数数组的形式返回这两个数的下标值。numbers 的下标 从 1 开始计数 ，所以答案数组应当满足 1 <= answer[0] < answer[1] <= numbers.length 。

  你可以假设每个输入只对应唯一的答案，而且你不可以重复使用相同的元素。

   
  示例 1：

  输入：numbers = [2,7,11,15], target = 9
  输出：[1,2]
  解释：2 与 7 之和等于目标数 9 。因此 index1 = 1, index2 = 2 。
  示例 2：

  输入：numbers = [2,3,4], target = 6
  输出：[1,3]
  示例 3：

  输入：numbers = [-1,0], target = -1
  输出：[1,2]


  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/two-sum-ii-input-array-is-sorted
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */

/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(numbers, target) {
  var i, index,low, high, length = numbers.length;

  for (i = 0; i < length; i++) {
    low = i+1;
    high = length - 1;

    while(low <= high) {
      index = low + ((high - low) / 2) ^ 0;
      if (numbers[index] === (target - numbers[i]))
        return [i+1, index + 1];
      if (numbers[index] < (target - numbers[i])) {
        low = index + 1;
      } else {
        high = index - 1;
      }
    }
  }

  return [];
};