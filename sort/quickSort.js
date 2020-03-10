/**
* @name: quickSort
* @description: 快速排序
*/

const origin = [32, 43, 1, 100, 10, 11, 50, 7, 8, 200, 2, 1000];
const sorted = [];

function sortIterator(origin, sorted) {
  var left = [], right = [];
  var flag = origin[parseInt(origin.length / 2)];

  for (var i = 0; i < origin.length; i++) {
    if (origin[i] > flag) {
      right.push(origin[i]);
    } else if(origin[i] < flag) {
      left.push(origin[i]);
    }
  }
  left = (left.length > 1) ? sortIterator(left, []) : left;
  sorted = [].concat(left);
  sorted = sorted.concat([flag]);
  right = (right.length > 1) ? sortIterator(right, []) : right;
  sorted = sorted.concat(right);

  return sorted;
}

console.log('result => ',sortIterator(origin, sorted));
