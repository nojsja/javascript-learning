/**
* @name: bubbleSort
* @description: 选择排序
*/

const origin = [32, 43, 1, 100, 10, 11, 50, 7, 8, 200, 2, 1000];
const sorted = [];

function selectSort(origin, sorted) {
  var max,temp;
  for (var i = 0; i < origin.length ; i++) {
    max = 0;
    for (var j = 1; j < origin.length - i; j++) {
      if (origin[j] > origin[max]) {
        max = j;
      }
    }
    temp = origin[j - 1];
    origin[j - 1] = origin[max];
    origin[max] = temp;
  }

  return origin;
}

console.log('result => ', selectSort(origin, sorted));
