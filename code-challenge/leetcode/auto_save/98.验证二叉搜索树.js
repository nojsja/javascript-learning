/*
 * @lc app=leetcode.cn id=98 lang=javascript
 *
 * [98] 验证二叉搜索树
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
var isValidBST = function(root, array=[]) {
  var bool = true;
  
  if (root.left) {
    bool = isValidBST(root.left, array);
  }

  array.push(root.val);

  if (bool && array.length > 1) {
    bool = array[array.length - 1] > array[array.length - 2];
    array.shift();
  }

  if (bool && root.right) {
    bool = isValidBST(root.right, array);
  }

  return bool;
};
// @lc code=end

