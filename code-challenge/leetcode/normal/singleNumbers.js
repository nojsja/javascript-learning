/* -------------------------------------------------------
  description:
  一个整型数组 nums 里除两个数字之外，其他数字都出现了两次。请写程序找出这两个只出现一次的数字。要求时间复杂度是O(n)，空间复杂度是O(1)。

  示例 1：

  输入：nums = [4,1,4,6]
  输出：[1,6] 或 [6,1]

  示例 2：

  输入：nums = [1,2,10,4,1,4,3,3]
  输出：[2,10] 或 [10,2]


  限制：

      2 <= nums.length <= 10000
------------------------------------------------------- */

/* *************** 解法1 *************** */

var singleNumbers = function(nums) {
  var i = 0, index;
  var length = nums.length;
  if (length === 2) return nums;

  for (i; i < length - 3; i++) {
    index = nums.indexOf(nums[i], i + 1);
    if (index !== -1) {
      nums.unshift(nums[index]);
      nums.splice(index + 1, 1);
      i += 1;
    } else {
      nums.push(nums[i]);
      nums.splice(i , 1);
      i -= 1;
    }
  }

  return [nums[length - 2], nums[length - 1]];
};

/* *************** 解法2 *************** */

singleNumbers = function(nums) {
  var i = 0, index, tmp, length = nums.length;
  var array = [];
  if (length === 2) return nums;
  
  for (i; i < length; i++) {
    tmp = nums.splice(i, 1)[0];
    index = nums.indexOf(tmp);
    length -= 1;
    if (index === -1) {
      array.push(tmp);
      length += 1;
      if (array.length === 2) break;
    } else {
      nums.splice(index, 1);
      length -= 1;
    }
    i -= 1;
  }

  return array;
};

/* *************** 解法3 *************** */
singleNumbers = function(nums) {
  var i = 0, length = nums.length, keys;
  var strMap = {};
  if (length === 2) return nums;
  
  for (i; i < length; i++) {
    if (strMap[nums[i]]) {
      delete strMap[nums[i]];
    } else {
      strMap[nums[i]] = 1;
    }
  }
  keys = Object.keys(strMap);
  return [Number(keys[0]), Number(keys[1])];
};

console.log(singleNumbers([1,3,4,5,3,4,5,2]));