/* -------------------------------------------------------
  description:
  给你 n 个非负整数 a1，a2，...，an，每个数代表坐标中的一个点 (i, ai) 。在坐标内画 n 条垂直线，垂直线 i 的两个端点分别为 (i, ai) 和 (i, 0) 。找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。

  说明：你不能倾斜容器。

  

  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/container-with-most-water
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */

/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
  var max = 0;
  var start = 0, end;

  while(start < height.length - 1) {
    end = start + 1;
    while(end < height.length) {
      max = Math.max(max, (end - start) * Math.min(height[start], height[end]));
      end += 1;
    }
    start += 1;
  }

  return max;
};

var maxArea2 = function(height) {
  var max = 0;
  var start = 0, end = height.length - 1;

  if (height.length < 2) return 0;

  while(start !== end) {
    max = Math.max(max, (end - start) * Math.min(height[start], height[end]));
    if (height[start] > height[end])
      end -= 1
    else
      start += 1
  }

  return max;
};

console.log(maxArea([1,8,6,2,5,4,8,3,7]));
console.log(maxArea([4,3,2,1,4]));