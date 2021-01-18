/**
* @name: bubbleSort
* @description: 冒泡排序
*/

var origin = [32, 43, 1, 100, 10, 11, 50, 7, 8, 200, 2, 1000];

function bubbleSort(origin) {
  var temp;
  for (var i = 0; i < origin.length ; i++) {
    for (var j = 0; j < origin.length - 1 - i; j++) {
      if (origin[j] > origin[j+1]) {
        temp = origin[j];
        origin[j] = origin[j+1];
        origin[j+1] = temp;
      }
    }
  }

  return origin;
}

console.log('result => ', bubbleSort(origin));
