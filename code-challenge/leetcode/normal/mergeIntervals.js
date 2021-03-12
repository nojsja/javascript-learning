/* -------------------------------------------------------
  description:

  以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间。

  示例 1：

  输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
  输出：[[1,6],[8,10],[15,18]]
  解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6].
  示例 2：

  输入：intervals = [[1,4],[4,5]]
  输出：[[1,5]]
  解释：区间 [1,4] 和 [4,5] 可被视为重叠区间。

  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/merge-intervals
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */

/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {
  var length = intervals.length, tmp, tmp2;
  intervals = intervals.sort((a,b) => {
    if (a[0] < b[0]) return -1;
    return 1;
  });
  var stack = [intervals[0]];
  for (var i = 1; i < length; i++) {    
    tmp = stack[stack.length - 1];
    tmp2 = intervals[i];
    if (tmp2[0] > tmp[1]) {
      stack.push(tmp2);
    } else {
      if (tmp[1] < tmp2[1])
        tmp[1] = tmp2[1];
      if (tmp[0] > tmp2[0])
        tmp[0] = tmp2[0]
    }
  }
  return stack;
};