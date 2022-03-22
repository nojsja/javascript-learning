/*
 * @lc app=leetcode.cn id=113 lang=javascript
 *
 * [113] 路径总和 II
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
 * @param {number} targetSum
 * @return {number[][]}
 */
var pathSum = function(root, targetSum) {
  var res = [];

  if (!root) return res;

  var findPath = function(node, sum, paths) {
    if (!node) return paths;
    paths.push(node.val);
    if (!node.left && !node.right && sum === node.val) {
      res.push(paths.slice());
      return paths.pop();
    }
    findPath(node.left, sum - node.val, paths);
    findPath(node.right, sum - node.val, paths);
    paths.pop();
  };

  findPath(root, targetSum, []);

  return res;
};
// @lc code=end

