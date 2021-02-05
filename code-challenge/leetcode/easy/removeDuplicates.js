/* -------------------------------------------------------
  description:
  给定一个排序数组，你需要在 原地 删除重复出现的元素，使得每个元素只出现一次，返回移除后数组的新长度。

  不要使用额外的数组空间，你必须在 原地 修改输入数组 并在使用 O(1) 额外空间的条件下完成。


  示例 1:

  给定数组 nums = [1,1,2], 

  函数应该返回新的长度 2, 并且原数组 nums 的前两个元素被修改为 1, 2。 

  你不需要考虑数组中超出新长度后面的元素。
  示例 2:

  给定 nums = [0,0,1,1,1,2,2,3,3,4],

  函数应该返回新的长度 5, 并且原数组 nums 的前五个元素被修改为 0, 1, 2, 3, 4。

  你不需要考虑数组中超出新长度后面的元素。

  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */

/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
  var index = null;
  for (var i = 0; i < nums.length; i++) {
    while(true) {
      index = nums.indexOf(nums[i], i+1);
      if (index === -1) break;
      nums.splice(index, 1);
    }
  }
  return nums.length;
};

console.log(removeDuplicates([0,0,1,1,1,2,2,3,3,4]));