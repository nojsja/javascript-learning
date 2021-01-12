/* -------------------------------------------------------
  description: 插入排序
  插入排序的代码实现虽然没有冒泡排序和选择排序那么简单粗暴，
  但它的原理应该是最容易理解的了，因为只要打过扑克牌的人都应该能够秒懂。
  插入排序是一种最简单直观的排序算法，它的工作原理是通过构建有序序列，
  对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。
  插入排序和冒泡排序一样，也有一种优化算法，叫做拆半插入。
------------------------------------------------------- */

const origin = [32, 43, 1, 100, 10, 11, 50, 7, 8, 200, 2, 1000];

function insertSort(array) {
  var i, cur, tmp;

  for (i = 1; i < array.length; i++) {
    cur = i;
    while(cur - 1 >= 0 && array[cur - 1] > array[cur]) {
      tmp = array[cur];
      array[cur] = array[cur - 1];
      array[cur - 1] = tmp;
      cur--;
    }
  }

  return array;
}

console.log(insertSort(origin));