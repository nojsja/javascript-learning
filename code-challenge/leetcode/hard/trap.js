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