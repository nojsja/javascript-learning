/* -------------------------------------------------------
  description:
  给定一个二叉树，检查它是否是镜像对称的。

  例如，二叉树 [1,2,2,3,4,4,3] 是对称的。

      1
    / \
    2   2
  / \ / \
  3  4 4  3
   

  但是下面这个 [1,2,2,null,3,null,3] 则不是镜像对称的:

      1
    / \
    2   2
    \   \
    3    3

  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/symmetric-tree
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function(root) {
  var check = function(tl, tr) {
      if (!tl && !tr) return true;
      if (!tl || !tr) return false;
      return (tl.val === tr.val) &&
          check(tl.left, tr.right) &&
          check(tl.right, tr.left);
  };

  return root ? check(root.left, root.right) : true;
};