/*
 * @lc app=leetcode.cn id=1260 lang=javascript
 *
 * [1260] 二维网格迁移
 */

// @lc code=start
/**
 * @param {number[][]} grid
 * @param {number} k
 * @return {number[][]}
 */
var shiftGrid = function(grid, k) {
  const xLength = grid[0].length;
  const yLength = grid.length;
  const newGrid = new Array(yLength).fill(null).map(() => new Array(xLength));

  const getX = function(x, y, step) {
    return (x + step) % xLength;
  };

  const getY = function(x, y, step) {
    return (parseInt(( x + step % (xLength * yLength)) / xLength, 10) + y) % yLength;
  };

  for (let i = 0; i < yLength; i++) {
    for (let j = 0; j < xLength; j++) {
      const x = getX(j, i, k);
      const y = getY(j, i, k);
      newGrid[y][x] = grid[i][j];
    }
  }

  return newGrid;
};
// @lc code=end

