/**
* @name: bubbleSort
* @description: 冒泡排序
*/

const origin = [32, 43, 1, 100, 10, 11, 50, 7, 8, 200, 2, 1000];
const sorted = [];

function bubbleSort(origin, sorted) {
  var temp;
  for (var i = 0; i < origin.length ; i++) {
    for (var j = 0; j < origin.length - i - 1; j++) {
      if (origin[j] > origin[j+1]) {
        temp = origin[j];
        origin[j] = origin[j+1];
        origin[j+1] = temp;
      }
    }
  }

  return origin;
}

console.log('result => ', bubbleSort(origin, sorted));
