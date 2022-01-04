/*
 * @lc app=leetcode.cn id=102 lang=javascript
 *
 * [102] 二叉树的层序遍历
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
 * @return {number[][]}
 */
var levelOrder2 = function(root) {
  var array = [];
  var bfs = function(nodes, results) {
    if (!nodes.length) return;
    var result = [];
    var levels = [];
    for (var i = 0; i < nodes.length; i++) {
      result.push(nodes[i].val);
      if (nodes[i].left) {
        levels.push(nodes[i].left);
      }
      if (nodes[i].right) {
        levels.push(nodes[i].right);
      }
    }
    results.push(result);
    bfs(levels, results);
  };

  if (root) bfs([root], array);

  return array;
};

var levelOrder = function(root) {
  var results = [];
  var array = [root];
  var remain = 1;
  var count = 0;
  var result = [];

  if (!root) return results;

  while(array.length) {
    var cur = array.pop();
    remain--;
    result.push(cur.val);
    if (cur.left) {
      count++;
      array.unshift(cur.left);
    }
    if (cur.right) {
      count++;
      array.unshift(cur.right);
    }
    if (remain === 0) {
      remain = count;
      count = 0;
      results.push(result);
      result = [];
    }
  }

  return results;
};
// @lc code=end

