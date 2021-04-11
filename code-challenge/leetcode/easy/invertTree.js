/* -------------------------------------------------------
  description:
  翻转一棵二叉树。

  示例：

  输入：

      4
    /   \
    2     7
  / \   / \
  1   3 6   9
  输出：

      4
    /   \
    7     2
  / \   / \
  9   6 3   1

  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/invert-binary-tree
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
 var invertTree = function(root) {
  var tmp;
  if (!root)
      return root;

  tmp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(tmp);

  return root;
};