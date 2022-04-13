/*
 * @lc app=leetcode.cn id=404 lang=javascript
 *
 * [404] 左叶子之和
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
 * @param {TreeNode} root
 * @return {number}
 */
var sumOfLeftLeaves = function(root, sum = 0) {
  if (!root) return sum;
  
  if (root.left && !root.left.left && !root.left.right) {
    sum += root.left.val;
  } else {
    sum = sumOfLeftLeaves(root.left, sum);
  }
  sum = sumOfLeftLeaves(root.right, sum);

  return sum;
};
// @lc code=end

