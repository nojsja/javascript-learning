/**
 * 42. 接雨水
给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。
输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
输出：6
解释：上面是由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示的高度图，在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。 
 */
/**
 * @param {number[]} height
 * @return {number}
 */
function trap(height) {
  let result = 0;

  function getWaterHeight(startPoint, endPoint) {
    let containerHeight = 0;
    const isStartGreaterThanEnd = height[startPoint] > height[endPoint];
    const startIndex = isStartGreaterThanEnd ? (startPoint + 1) : startPoint;
    const endIndex = isStartGreaterThanEnd ? endPoint : (endPoint - 1)

    for (let index = startIndex; index <= endIndex; index++) {
      containerHeight += height[index];
    }

    const waterHeight = (endPoint - startPoint) * Math.min(height[startPoint], height[endPoint]) - containerHeight;
    const waterHeightFinal = waterHeight > 0 ? waterHeight : 0;

    return waterHeightFinal;
  }

  function findWaterEdge(startEdge, endEdge) {
    if (height[startEdge] === 0) {
      startEdge += 1;
    }
    if (height[endEdge] === 0) {
      endEdge -= 1;
    }
    if (startEdge >= endEdge) {
      return;
    }
    let nextMiddleHeightIndex = -1;
    let nextMiddleHeight = 0;

    for (let index = startEdge + 1; index < endEdge; index++) {
      if ((height[index] > height[startEdge]) || (height[index] > height[endEdge])) {
        nextMiddleHeightIndex = height[index] > nextMiddleHeight ? index : nextMiddleHeightIndex;
        nextMiddleHeight = height[index] > nextMiddleHeight ? height[index] : nextMiddleHeight;
      }
    }

    if (nextMiddleHeightIndex > 0) {
      findWaterEdge(startEdge, nextMiddleHeightIndex);
      findWaterEdge(nextMiddleHeightIndex, endEdge);
      return;
    }

    const waterHeight = getWaterHeight(startEdge, endEdge);

    result += waterHeight;
  }

  findWaterEdge(0, height.length - 1);

  return result;
}

// console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1]));
// console.log(trap([4,2,3]));
console.log(trap([2,9,6,3,6,7,6]));