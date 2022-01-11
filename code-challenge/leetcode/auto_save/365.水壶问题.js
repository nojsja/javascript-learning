/*
 * @lc app=leetcode.cn id=365 lang=javascript
 *
 * [365] 水壶问题
 */

// @lc code=start
/**
 * @param {number} jug1Capacity
 * @param {number} jug2Capacity
 * @param {number} targetCapacity
 * @return {boolean}
 */
var canMeasureWater = function(jug1Capacity, jug2Capacity, targetCapacity) {
  if (jug1Capacity + jug2Capacity < targetCapacity)
    return false;

  var greater = Math.max(jug1Capacity, jug2Capacity);
  var smaller = Math.min(jug1Capacity, jug2Capacity);
  tmp = smaller;

  while (tmp !== 0) {
    tmp = greater % smaller;
    greater = smaller;
    smaller = tmp;
  }

  return Number.isInteger(targetCapacity / greater);
};
// @lc code=end

