/* -------------------------------------------------------
  description:
  一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 “Start” ）。

  机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。

  问总共有多少条不同的路径？

         n

    |*|||||||||||
    ------------
  m ||||||||||||
    ------------
    |||||||||||*|



  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/unique-paths
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */

/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var uniquePaths = function(m, n) {
  var dp = {};
  var x = 1, y = 1;
  while(y <= m) {
    x = 1;
    while(x <= n) {
      if (x === 1 || y === 1) {
        dp[String(y)+x] = 1;
      } else {
        dp[String(y)+x] = dp[String(y-1)+x] + dp[y+String(x-1)];
      }
      x++;
    }
    y++;
  }

  return dp[String(m)+n];
};

console.log(uniquePaths(3, 7));