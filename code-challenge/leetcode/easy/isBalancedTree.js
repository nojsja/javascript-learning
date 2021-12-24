/* -------------------------------------------------------
  description：
  给定一个二叉树，判断它是否是高度平衡的二叉树。

  本题中，一棵高度平衡二叉树定义为：

  一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过 1 。

  输入：root = [3,9,20,null,null,15,7]
  输出：true

  输入：root = [1,2,2,3,3,null,null,4,4]
  输出：false
------------------------------------------------------- */

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
 var isBalanced = function(root) {
  if (!root) return true;

  var leftDepth = root.left ? isBalanced(root.left) : 0;
  var rightDepth = root.right ? isBalanced(root.right) : 0;

  if (leftDepth === false || rightDepth === false) {
      return false;
  }

  if (Math.abs(leftDepth - rightDepth) > 1) {
      return false;
  }

  return Math.max(leftDepth + 1, rightDepth + 1);
};