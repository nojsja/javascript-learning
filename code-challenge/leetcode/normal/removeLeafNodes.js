/* -------------------------------------------------------
  description:
  给你一棵以 root 为根的二叉树和一个整数 target ，请你删除所有值为 target 的 叶子节点 。

  注意，一旦删除值为 target 的叶子节点，它的父节点就可能变成叶子节点；如果新叶子节点的值恰好也是 target ，那么这个节点也应该被删除。

  也就是说，你需要重复此过程直到不能继续删除。

  

  示例 1：

  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/delete-leaves-with-a-given-value
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
 * @param {number} target
 * @return {TreeNode}
 */
var removeLeafNodes = function(root, target, parent=null, attr=null) {
  if (root.left) removeLeafNodes(root.left, target, root, 'left');
  if (root.right) removeLeafNodes(root.right, target, root, 'right');
  if (!root.left && !root.right && root.val === target) {
    if (parent)
      parent[attr] = null
    else
      root = null;
  }
  
  return root;
};