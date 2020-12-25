/* -------------------------------------------------------
  description:
  给定一个二叉树的前序遍历 ，返回它的 后序 遍历。
  输入：root = [1,null,2,3]
  输出：[3,2,1]
  tree:           1
                   \
                    2
                   /
                  3
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
 * @return {number[]}
 */
var postorderTraversal = function(root, res=[]) {

  if (root && root.left) postorderTraversal(root.left, res);
  if (root && root.right) postorderTraversal(root.right, res);
  root && res.push(root.val);

  return res;
};