const _ = require("underscore");

// exity 旨在定义事物的存在 //
function exity(obj) {
  // 松散不等云算法可以区分undefined, null, 和其他对象
  return obj != null;
}

// trusty 用来判断一个对象是否是true的同义词 //
function trusty(obj) {
  return( (obj !== false) && exity(obj) );
}

{
  // true false true true false false
  console.log( exity(false), exity(null), exity(0),
    exity(''), exity(undefined), exity(function () {}()) );
  // false false true true false false
  console.log( trusty(false), trusty(null), trusty(0),
  trusty(''), trusty(undefined), trusty(function () {}()) );

  // 条件为真执行 //
  function doWhen(cond, action) {
    if (trusty(cond)) {
      return action();
    }else {
      return undefined;
    }
  }

  // 对象包含域获取执行结果 //
  function executeIfHasField(target, name) {
    return doWhen(target[name], function () {
      let result = _.result(target, name);
      console.log("The result is: " + result);
      return result;
    });
  }
  // 数组倒序
  executeIfHasField([1, 2, 3], 'reverse');
}

{
  /**
   * Applicative编程，函数传参
   */

  let array = [1, 2, 3, 4, 5];

  // 加倍
  function doubleArray(array) {
    return _.map(array, function(elem) {
      return elem * 2;
    });
  }
  console.log('double: ' + doubleArray(array));

  // 求平均值
  function average(array) {
    let result = _.reduce(array, function (a, b) {
      return a + b;
    });

    return result / _.size(array);
  }
  console.log('average: ' + average([1, 2, 3]));

  // filter
  function filter(array) {
    return _.filter(array, function (elem) {
      return elem % 2 == 0;
    });
  }
  console.log('filter: ' + filter([1, 2, 3, 4]));
}
