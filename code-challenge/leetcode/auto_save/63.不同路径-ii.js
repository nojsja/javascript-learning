/*
 * @lc app=leetcode.cn id=63 lang=javascript
 *
 * [63] 不同路径 II
 */

// @lc code=start
/**
 * @param {number[][]} obstacleGrid
 * @return {number}
 */
var uniquePathsWithObstacles = function(obstacleGrid) {
  var dp = {};
  var xLength = obstacleGrid[0].length;
  var yLength = obstacleGrid.length;
  var i = j = 0;
  var tmp;

  for (i; i < yLength; i++) {
    j = 0;
    for (j; j < xLength; j++) {
      tmp = '' + i +j;
      if (obstacleGrid[i][j] === 1) {
        dp[tmp] = 0;
        continue;
      }
      if (i === 0 && j === 0 ) {
        dp[tmp] = obstacleGrid[0][0] === 1 ? 0 : 1;
        continue;
      }
      if (i === 0) {
        dp[tmp] = dp['' + i + (j - 1)];
        continue;
      }
      if (j === 0) {
        dp[tmp] = dp['' + (i - 1) + j];
        continue;
      }
      dp[tmp] = dp['' + (i - 1) + j] + dp['' + i + (j - 1)];
    }
  }

  return dp['' + (yLength - 1) + (xLength - 1)];
};
// @lc code=end

