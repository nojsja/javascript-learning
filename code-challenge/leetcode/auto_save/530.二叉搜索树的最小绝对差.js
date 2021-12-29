/*
 * @lc app=leetcode.cn id=530 lang=javascript
 *
 * [530] 二叉搜索树的最小绝对差
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
var getMinimumDifference = function(root) {
  var min = Infinity;
  var array = [];

  var tranverse = function (node) {
    if (!node) return;
    tranverse(node.left);
    array.push(node.val);
    if (array.length > 1) {
      min = Math.min(array[array.length - 1] - array[array.length - 2], min);
      array.shift();
    }
    tranverse(node.right);
  };

  tranverse(root);

  return min;
};
// @lc code=end

