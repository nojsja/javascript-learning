/* -------------------------------------------------------
  description:
  给定一个含有 n 个正整数的数组和一个正整数 target 。

  找出该数组中满足其和 ≥ target 的长度最小的 连续子数组 [numsl, numsl+1, ..., numsr-1, numsr] ，并返回其长度。如果不存在符合条件的子数组，返回 0 。

   

  示例 1：

  输入：target = 7, nums = [2,3,1,2,4,3]
  输出：2
  解释：子数组 [4,3] 是该条件下的长度最小的子数组。
  示例 2：

  输入：target = 4, nums = [1,4,4]
  输出：1
  示例 3：

  输入：target = 11, nums = [1,1,1,1,1,1,1,1]
  输出：0
   

  提示：

  1 <= target <= 109
  1 <= nums.length <= 105
  1 <= nums[i] <= 105
   

  进阶：

  如果你已经实现 O(n) 时间复杂度的解法, 请尝试设计一个 O(n log(n)) 时间复杂度的解法。

  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/minimum-size-subarray-sum
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */


/* -------------- 暴力法 -------------- */

/**
 * @param {number} target
 * @param {number[]} nums
 * @return {number}
 */
 var minSubArrayLen = function(target, nums) {
  var start = 0, end = 1, res = 0, length = 0;

  while (start < nums.length) {
      for (end = start; end < nums.length; end++) {
          res += nums[end];
          if (res >= target) {
              length = length ? Math.min(length, end - start + 1) : end - start + 1;
              break;
          }
      }
      res = 0;
      start++;
  }

  return length;
};

/* -------------- 双指针法 -------------- */

/**
 * @param {number} target
 * @param {number[]} nums
 * @return {number}
 */
var minSubArrayLen = function(target, nums) {
    var start = 0, end = 0, res = 0, length = Infinity;
    while (end < nums.length) {
        res += nums[end];
        while (res >= target) {
            length = Math.min(length , end - start + 1);
            res -= nums[start];
            start++;
        }
        end++;
    }

    return length === Infinity ? 0 : length;
};