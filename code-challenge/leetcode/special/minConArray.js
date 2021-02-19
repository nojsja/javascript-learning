/* -------------------------------------------------------
  description:
  给定一个数组加数字 n 求加和大于等于 n 的最短连续子数组 的长度 [5, 7, 3, 4, 8, 2, 9, 1, 6] 
  n = 8  1 
  n = 17 3 
  n = 1000 -1 
------------------------------------------------------- */

function minConArray(array, n) {
  var start = 0, end, res=-1, sum=0;

  if (array.length === 0)
    return -1;
  
  while(start < array.length) {
    end = start;
    sum = 0;
    for (end; end < array.length; end++) {
      sum += array[end];
      if (sum >= n) {
        res = end - start ||  1;
        break;
      }
    }
    start++;
  }

  return res;
}

console.log(minConArray([5, 7, 3, 4, 8, 2, 9, 1, 6], 1000));