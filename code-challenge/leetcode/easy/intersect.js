/* -------------------------------------------------------
  description:
  给定两个数组，编写一个函数来计算它们的交集。

   

  示例 1：

  输入：nums1 = [1,2,2,1], nums2 = [2,2]
  输出：[2,2]
  示例 2:

  输入：nums1 = [4,9,5], nums2 = [9,4,9,8,4]
  输出：[4,9]
   

  说明：

  输出结果中每个元素出现的次数，应与元素在两个数组中出现次数的最小值一致。
  我们可以不考虑输出结果的顺序。
  进阶：

  如果给定的数组已经排好序呢？你将如何优化你的算法？
  如果 nums1 的大小比 nums2 小很多，哪种方法更优？
  如果 nums2 的元素存储在磁盘上，内存是有限的，并且你不能一次加载所有的元素到内存中，你该怎么办？

  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/intersection-of-two-arrays-ii
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */

/* -------------- map法 -------------- */

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
 var intersect = function(nums1, nums2) {
  var map = {};
  var res = [];

  for (var i = 0; i < nums1.length; i++) {
      map[nums1[i]] = map[nums1[i]] || 0;
      map[nums1[i]]++;
  }
  for (var i = 0; i < nums2.length; i++) {
      if (map[nums2[i]]) {
          res.push(nums2[i]);
          map[nums2[i]]--;
      }
  }

  return res;
};

/* -------------- 双指针法 -------------- */

/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
 var intersect = function(nums1, nums2) {
  var i = j = 0;
  var res = [];

  nums1 = nums1.sort((a,b) => a-b);
  nums2 = nums2.sort((a,b) => a-b);

  while (i < nums1.length && j < nums2.length) {
      if (nums1[i] === nums2[j]) {
          res.push(nums1[i]);
          i++;
          j++;
      } else if (nums1[i] < nums2[j]) {
          i++;
      } else {
          j++;
      }
  }

  return res;
};