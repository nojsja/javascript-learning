/*
 * @lc app=leetcode.cn id=48 lang=javascript
 *
 * [48] 旋转图像
 */

/* 
row=col
col=n−row−1
 */

// @lc code=start
/**
 * @param {number[][]} matrix
 * @return {void} Do not return anything, modify matrix in-place instead.
 */
var rotate = function(matrix) {
  var n = matrix.length;
  var tmp;

  for (var i = 0; i < (n >> 1); i++) {
    for (var j = 0; j < ((n + 1) >> 1); j++) {
      tmp = matrix[j][n - i - 1];
      matrix[j][n - i - 1]  = matrix[i][j];
      matrix[i][j] = matrix[n - j - 1][i];
      matrix[n - j - 1][i] = matrix[n - i - 1][n - j - 1];
      matrix[n - i - 1][n - j - 1] = tmp;
    }
  }

  return matrix;
};
// @lc code=end

