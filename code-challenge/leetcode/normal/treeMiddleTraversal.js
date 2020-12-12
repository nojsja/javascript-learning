/* -------------------------------------------------------
  description:
  给定一个二叉树的前序遍历 ，返回它的 中序 遍历。
  输入：root = [1,null,2,3]
  输出：[1,3,2]
  tree:           1
                   \
                    2
                   /
                  3
------------------------------------------------------- */

var root = [1, null, 2, 3];
// var root = [];
// var root = [1];
// var root = [1, 2];
// var root = [1, null, 2];

var processor = function() {

  var rootTree;
  var result = [];

  /* 简单的二叉树构造 */
  function Tree(v, left, right) {
    this.value = v;
    this.left = left || null;
    this.right = right || null;
  }
  
  
  /* 根据前序遍历生成树结构 */
  var treeFromFrontTraversal = function(nodes) {
    var node = nodes.shift();
    if (!node) return null;
    var tree = new Tree(node);
    tree.left = treeFromFrontTraversal(nodes);
    tree.right = treeFromFrontTraversal(nodes)
    return tree;
  }
  
  rootTree = treeFromFrontTraversal(root);
  
  /* 将树以中序遍历返回 */
  var treeMiddleTraversal = function(tree) {
    if (!tree) return;
    treeMiddleTraversal(tree.left)
    result.push(tree.value);
    treeMiddleTraversal(tree.right)
  };

  // rootTree && treeMiddleTraversal(rootTree);
  // return result;

  /* 将树以中序遍历返回(方法2：使用迭代) */
  var inorderTraversal = function(root) {
    var stack = [];
    var res = [];
  
    while (root || stack.length) {
      while (root && root.value) {
        stack.push(root);
        root = root.left;
      }
  
      root = stack.pop();
      res.push(root.value);
      root = root.right;
    }
  
    return res;
  };

  return inorderTraversal(rootTree);
}

console.log(processor(root));

