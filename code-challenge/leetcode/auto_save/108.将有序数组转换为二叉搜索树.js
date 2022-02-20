/*
 * @lc app=leetcode.cn id=108 lang=javascript
 *
 * [108] 将有序数组转换为二叉搜索树
 */

// @lc code=start
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {number[]} nums
 * @return {TreeNode}
 */
var sortedArrayToBST = function(nums) {
  if (!nums.length) return null;

  var mid = nums.length >> 1;
  var midNode = new TreeNode(nums[mid]);

  midNode.left = sortedArrayToBST(nums.slice(0, mid));
  midNode.right = sortedArrayToBST(nums.slice(mid + 1, nums.length));

  return midNode;
};
// @lc code=end

