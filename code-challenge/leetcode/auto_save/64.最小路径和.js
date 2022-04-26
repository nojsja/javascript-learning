/*
 * @lc app=leetcode.cn id=64 lang=javascript
 *
 * [64] 最小路径和
 */

// @lc code=start
/**
 * @param {number[][]} grid
 * @return {number}
 */
var minPathSum = function(grid) {
  var dp = {};
  var i, j;
  var m = grid.length, n = grid[0].length;

  for (i = 0; i < m; i++) {
    for (j = 0; j < n; j++) {
      if (i === 0) {
        dp[`${i}${j}`] = grid[i][j] + (dp[`${i}${j - 1}`] || 0);
      } else if (j === 0) {
        dp[`${i}${j}`] = grid[i][j] + (dp[`${i - 1}${j}`] || 0);
      } else {
        dp[`${i}${j}`] = grid[i][j] + Math.min(dp[`${i}${j - 1}`], dp[`${i - 1}${j}`]);
      }
    }
  }

  return dp[`${m - 1}${n - 1}`];
};
// @lc code=end

