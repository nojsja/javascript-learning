/**
* @name: selectSort
* @description: 选择排序
*/

var origin = [32, 43, 1, 100, 10, 11, 50, 7, 8, 200, 2, 1000];

function selectSort(origin) {
  var min, temp;
  for (var i = 0; i < origin.length - 1; i++) {
    min = i;
    for (var j = i + 1; j < origin.length; j++) {
      if (origin[j] < origin[min]) {
        min = j;
      }
    }
    temp = origin[i];
    origin[i] = origin[min];
    origin[min] = temp;
  }

  return origin;
}

console.log('result => ', selectSort(origin));
