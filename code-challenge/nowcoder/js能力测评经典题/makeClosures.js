/* -----------------------------------------------------------------------------
  实现函数 makeClosures，调用之后满足如下条件：
  1、返回一个函数数组 result，长度与 arr 相同
  2、运行 result 中第 i 个函数，即 result[i]()，结果与 fn(arr[i]) 相同
----------------------------------------------------------------------------- */
function makeClosures(arr, fn) {
  return arr.map(function (item) {
    return function () {
      return fn(item);
    }
  });
}

console.log( makeClosures([1, 2, 3], function (item) {
  console.log(item);
  return item * item;
})[1]() );
