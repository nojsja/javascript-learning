/* -------------------------------------------------------
  description:
  给你两个有序整数数组 nums1 和 nums2，请你将 nums2 合并到 nums1 中，使 nums1 成为一个有序数组。

  初始化 nums1 和 nums2 的元素数量分别为 m 和 n 。你可以假设 nums1 有足够的空间（空间大小等于 m + n）来保存 nums2 中的元素。

   

  示例 1：

  输入：nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
  输出：[1,2,2,3,5,6]
  示例 2：

  输入：nums1 = [1], m = 1, nums2 = [], n = 0
  输出：[1]

  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/merge-sorted-array
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */

/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function(nums1, m, nums2, n) {
  var i, cur, tmp;
  nums1.splice(m);
  nums2.splice(n);

  for (i = 0; i < nums2.length; i++) {
      nums1.push(nums2[i]);
      cur = m++;
      while(cur > 0) {
          if (nums1[cur - 1] > nums1[cur]) {
              tmp = nums1[cur];
              nums1[cur] = nums1[cur - 1];
              nums1[cur - 1] = tmp;
          } else {
              break;
          }
          cur--;
      }
  }

  return nums1;

};

var merge = function(nums1, m, nums2, n) {
  nums1 = nums1.slice(0, m);
  nums2 = nums2.slice(0, n);
  var array = [];

  while (nums1.length && nums2.length) {
    if (nums1[0] <= nums2[0]) {
      array.push(nums1.shift());
    } else {
      array.push(nums2.shift());
    }
  }

  return array.concat(nums1, nums2);
};

console.log(merge([1,2,3,0,0,0], 3, [2,5,6], 3));