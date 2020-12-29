/* -------------------------------------------------------
  description:
  给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。

  百度百科中最近公共祖先的定义为：“对于有根树 T 的两个结点 p、q，最近公共祖先表示为一个结点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。”

  例如，给定如下二叉树:  root = [3,5,1,6,2,0,8,null,null,7,4]

  示例 1:

  输入: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
  输出: 3
  解释: 节点 5 和节点 1 的最近公共祖先是节点 3。
  示例 2:

  输入: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4
  输出: 5
  解释: 节点 5 和节点 4 的最近公共祖先是节点 5。因为根据定义最近公共祖先节点可以为节点本身。
   

  说明:

  所有节点的值都是唯一的。
  p、q 为不同节点且均存在于给定的二叉树中。

  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-tree
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */

/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

function TreeNode(val) {
  this.val = val;
  this.left = this.right = null;
};

var node7 = new TreeNode(7);
var node4 = new TreeNode(4);
var node2 = new TreeNode(2);
var node6 = new TreeNode(6);
var node5 = new TreeNode(5);
var node3 = new TreeNode(3);
var node1 = new TreeNode(1);
var node0 = new TreeNode(0);
var node8 = new TreeNode(8);

node2.left = node7;
node2.right = node4;

node5.left = node6;
node5.right = node2;

node3.left = node5;
node3.right = node1;

node1.left = node0;
node1.right = node8;

var root = node3;


/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q, parent={}) {
  var tmp;
  if (!root) return null;

  tmp = lowestCommonAncestor(root.left, p, q, root);
  if (tmp) return tmp;
  tmp = lowestCommonAncestor(root.right, p, q, root);
  if (tmp) return tmp;

  root.p = root.p || ((root.val === p.val) ? true : undefined);
  root.q = root.q || ((root.val === q.val) ? true : undefined);
  if (root.p && root.q && !root.v) root.v = root;
  parent.p = root.p || parent.p;
  parent.q = root.q || parent.q;
  parent.v = root.v;
  tmp = root.v;

  delete root.p;
  delete root.q;
  delete root.v;
  
  return tmp;
};

console.log(lowestCommonAncestor(root, node6, node0));