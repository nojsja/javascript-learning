/**
给你二叉树的根结点 root ，请你将它展开为一个单链表：

展开后的单链表应该同样使用 TreeNode ，其中 right 子指针指向链表中下一个结点，而左子指针始终为 null 。
展开后的单链表应该与二叉树 先序遍历 顺序相同。
 */

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
 * @return {void} Do not return anything, modify root in-place instead.
 */
function TreeNode(val, left, right) {
      this.val = (val===undefined ? 0 : val)
      this.left = (left===undefined ? null : left)
      this.right = (right===undefined ? null : right)
}

function flattenLoop(treeNode) {
  if (!treeNode) {
    return [treeNode, null];
  }
  const left = treeNode.left;
  const right = treeNode.right;
  const [newRightNode, tailNodeInLeft] = flattenLoop(left);
  const [originRightNode, tailNodeInRight] = flattenLoop(right);
  let tailNode;

  tailNode = tailNodeInRight || tailNodeInLeft || treeNode;

  if (tailNodeInLeft) {
    tailNodeInLeft.right = originRightNode;
  }

  treeNode.right = newRightNode || originRightNode;
  treeNode.left = null;

  return [treeNode, tailNode];
}

function flatten(treeNode) {
    const [currentNode, tailNode] = flattenLoop(treeNode);

    return currentNode;
}