/* -------------------------------------------------------
  description:
  获取一个数组中连续的元素，输出格式：["3->4", "7->9"]
------------------------------------------------------- */

function getContinuousArray(array) {
  if (array.length < 2) return [];
  var res = [], start=0, end=1;

  while(start <= array.length - 2) {
    if (array[end] === array[end-1] + 1) {
      end ++;
    } else {
      if ((end - 1 - start > 1) || (array[end-1] - array[start] === 1))
        res.push(`${array[start]}->${array[end-1]}`);
      start = end;
      end++;
    }
  }

  return res;
}

console.log(getContinuousArray([1,2,3,6,8,9]))