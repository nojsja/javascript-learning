/* -----------------------------------------------------------------------------
  Memoization用于优化比较耗时的计算，通过将计算结果缓存到内存中，这样对于同样的输入值，
  下次只需要中内存中读取结果。
  原理：使用了闭包，内层函数对外层函数变量的引用，而内层函数又被外部变量fibonancci引用。
----------------------------------------------------------------------------- */
function memorizeFunction(fn) {
  var cache = {};

  return function () {
    var param = arguments[0];
    if (cache[param]) {
      return cache[param];
    }else {
      cache[param] = fn.call(null, param);
      return cache[param];
    }
  };
}

var fibonancci = memorizeFunction(function (n) {
  return (n === 0 || n === 1) ? n : fibonancci(n - 1) + fibonancci(n - 2);
});
console.time();
console.log(fibonancci(100));
console.timeEnd();
console.time();
console.log(fibonancci(100));
console.timeEnd();
