/* -------------------------------------------------------
  description:
  给定一个非负整数数组 nums ，你最初位于数组的 第一个下标 。

  数组中的每个元素代表你在该位置可以跳跃的最大长度。

  判断你是否能够到达最后一个下标。

   

  示例 1：

  输入：nums = [2,3,1,1,4]
  输出：true
  解释：可以先跳 1 步，从下标 0 到达下标 1, 然后再从下标 1 跳 3 步到达最后一个下标。
  示例 2：

  输入：nums = [3,2,1,0,4]
  输出：false
  解释：无论怎样，总会到达下标为 3 的位置。但该下标的最大跳跃长度是 0 ， 所以永远不可能到达最后一个下标。


  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/jump-game
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */

/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {
  var check = new Array(nums.length).fill(false);
  check[0+nums[0]] = true;
  for (var i = 1; i < nums.length; i++) {
    if (check.lastIndexOf(true) >= i) {
      check[i+nums[i]] = true;
    } else {
      break;
    }
  }

  return check.pop() === true;
};

var canJump = function(nums) {
  var maxRight = 0;
  for (var i = 0; i < nums.length; i++) {
    if (i <= maxRight) {
      maxRight = Math.max(maxRight, i + nums[i]);
    } else {
      return false;  
    }
  }

  return true;
};