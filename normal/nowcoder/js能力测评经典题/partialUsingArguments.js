/* -----------------------------------------------------------------------------
实现函数 partialUsingArguments，调用之后满足如下条件：
1、返回一个函数 result
2、调用 result 之后，返回的结果与调用函数 fn 的结果一致
3、fn 的调用参数为 partialUsingArguments 的第一个参数之后的全部参数以及 result 的调用参数
----------------------------------------------------------------------------- */

function partialUsingArguments(fn) {
  var outterArray = Array.prototype.slice.call(arguments);
  outterArray.shift();

  return function () {
    var innerArray = Array.prototype.slice.call(arguments);
    return fn.apply(null, outterArray.concat(innerArray));
  }
}
