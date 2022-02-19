/*
 * @lc app=leetcode.cn id=437 lang=javascript
 *
 * [437] 路径总和 III
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

 var find = function(node, val) {
  if (!node) return 0;
  var leftVal = find(node.left, val - node.val);
  var rightVal = find(node.right, val - node.val);
  return leftVal + rightVal + (node.val === val ? 1 : 0);
};

/**
 * @param {TreeNode} root
 * @param {number} targetSum
 * @return {number}
 */
var pathSum = function(root, targetSum) {
  if (!root) return 0;

  var self = find(root, targetSum);
  var left = pathSum(root.left, targetSum);
  var right = pathSum(root.right, targetSum);

  return self + right + left;
  
};
// @lc code=end

