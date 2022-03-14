/*
 * @lc app=leetcode.cn id=101 lang=javascript
 *
 * [101] 对称二叉树
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
 * @return {boolean}
 */
var isSymmetric = function(root) {

  function symmetric(left, right) {
    return (
      (!left && !right) ||
      (
        left && right &&
        (left.val === right.val) &&
        symmetric(left.left, right.right) && symmetric(left.right, right.left)
      ) ||
      false
    )
  }

  return (
    !root ||
    (!root.left && !root.right) ||
    symmetric(root.left, root.right)
  );
};
// @lc code=end

