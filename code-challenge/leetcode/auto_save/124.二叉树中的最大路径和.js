/*
 * @lc app=leetcode.cn id=124 lang=javascript
 *
 * [124] 二叉树中的最大路径和
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
var maxPathSum = function(root) {
  var max = root.val;

  var dfs = function(node) {
    if (!node) return -Infinity;
    var leftMax = -Infinity,
        rightMax = -Infinity,
        tmp = node.val;

    leftMax = dfs(node.left);
    rightMax = dfs(node.right);

    tmp = Math.max(
      tmp,
      node.val + leftMax,
      node.val + rightMax,
    );

    max = Math.max(
      max, leftMax, rightMax,
      leftMax + rightMax + node.val,
      tmp
    );

    return tmp;
  };

  dfs(root);

  return max;
};
// @lc code=end

