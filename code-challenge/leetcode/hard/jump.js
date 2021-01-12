/* -------------------------------------------------------
  description:
  给定一个非负整数数组，你最初位于数组的第一个位置。

  数组中的每个元素代表你在该位置可以跳跃的最大长度。

  你的目标是使用最少的跳跃次数到达数组的最后一个位置。

  示例:

  输入: [2,3,1,1,4]
  输出: 2
  解释: 跳到最后一个位置的最小跳跃数是 2。
       从下标为 0 跳到下标为 1 的位置，跳 1 步，然后跳 3 步到达数组的最后一个位置。
  说明:

  假设你总是可以到达数组的最后一个位置。

  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/jump-game-ii
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */

/**
 * @param {number[]} nums
 * @return {number}
 */
var jump = function(nums) {
  var start = 0;
  var end;
  var tmp;
  var step = 0;

  while(start < nums.length - 1) {
    end = start + nums[start]
    tmp = end;
    for (let i = start; i <= end; i++) {
      if (nums[i] + i > nums[tmp] + tmp) {
        tmp = i;
      }
      if ((i+nums[i] === nums.length - 1)) {
        tmp = nums.length - 1;
        break;
      }
    }
    step ++;
    start = tmp;
  }

  return step;
};

console.log(jump([2,3,1,1,4]));

return;

console.log(jump([2,3,1]));
// return;
console.log(jump([
  2,0,6,9,8,4,5,0,8,9,1, /* 10 */
  2,9,6,8,8,0,6,3,1,2, /* 20 */
  2,1,2,6,5,3,1,2,2,6, /* 30 */
  4,2,4,3,0,0,0,3,8,2, /* 40 */
  4,0,1,2,0,1,4,6,5,8, /* 50 */
  0,7,9,3,4,6,6,5,8,9, /* 60 */
  3,4,3,7,0,4,9,0,9,8, /* 70 */
  4,3,0,7,7,1,9,1,9,4, /* 80 */
  9,0,1,9,5,7,7,1,5,8, /* 90 */
  2,8,2,6,8,2,2,7,5,1, /* 100 */
  7,9,6]));