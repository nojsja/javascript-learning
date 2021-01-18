/**
* @name: quickSort
* @description: 快速排序
*/

var origin = [32, 43, 1, 100, 10, 11, 50, 7, 8, 200, 2, 1000];

function quickSort(origin) {
  if (!origin.length) return origin;

  var left = [], right = [];
  var flag = origin[(origin.length / 2) ^ 0];

  for (var i = 0; i < origin.length; i++) {
    if (origin[i] > flag) {
      right.push(origin[i]);
    } else if(origin[i] < flag) {
      left.push(origin[i]);
    }
  }

  return quickSort(left)
    .concat(flag)
    .concat(quickSort(right));
}

console.log('result => ', quickSort(origin));
