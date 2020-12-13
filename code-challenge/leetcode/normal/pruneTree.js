/* -------------------------------------------------------
  description:
  给定二叉树根结点 root ，此外树的每个结点的值要么是 0，要么是 1。

  返回移除了所有不包含 1 的子树的原二叉树。

  ( 节点 X 的子树为 X 本身，以及所有 X 的后代。)

  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/binary-tree-pruning
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
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
 * @return {TreeNode}
 */
var pruneTree = function(root) {
  if(root === null) {
      return null;
  }
  root.left = pruneTree(root.left);
  root.right = pruneTree(root.right);
  if(root.left === null && root.right === null && root.val === 0) {
    return null;
  }
  return root;
};