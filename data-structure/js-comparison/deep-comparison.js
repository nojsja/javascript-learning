/**
* @name: deep-comparison
* @description: js 数据深比较算法
* @author: nojsja
*/

/**
 * [deepComparison 深比较]
 * @param  {[type]} data [any]
 * @return {[type]}      [boolean]
 */
function deepComparison(data1, data2) {

  var hasOwnProperty = Object.prototype.hasOwnProperty;
  // 获取变量类型
  var getType = function (d) {
    if (typeof d === 'object') {
      if (!(d instanceof Object)) {
        return 'null';
      }
      if (d instanceof Date) {
        return 'date';
      }
      if (d instanceof RegExp) {
        return 'regexp';
      }

      // object / array //
      return 'object';

    } else {

      if (d !== d) {
        return 'nan';
      }
      return (typeof d).toLowerCase();
    }
  };

  // 基本类型比较
  var is = function (d1, d2, type) {
    if (type === 'nan') {
      return true;
    }
    if (type === 'date' || type === 'regexp') {
      return d1.toString() === d2.toString();
    }
    return (d1 === d2);
  }

  // 递归比较
  var compare = function (d1, d2) {
    var type1 = getType(d1);
    var type2 = getType(d2);

    if (type1 !== type2) {
      return false;
    }

    if (type1 === 'object') {
      var keys1 = Object.keys(d1).filter(function (k) {
        return hasOwnProperty.call(d1, k);
      });
      var keys2 = Object.keys(d2).filter(function (k) {
        return hasOwnProperty.call(d2, k);
      });
      if (keys1.length !== keys2.length) {
        return false;
      }
      for (var i = 0; i < keys1.length; i++) {
        if (
          !keys2.includes(keys1[i]) ||
          !compare(d1[keys1[i]], d2[keys2[keys2.indexOf(keys1[i])]]) ) {
          return false;
        }
      }
      return true;
    } else {
      return is(d1, d2, type1);
    }
  };

  return compare(data1, data2);
}


console.log(deepComparison(
  {a: {b: new Date(19999), c: [null, 2, undefined,  {a: /ab/gi}]}},
  {a: {b: new Date(19999), c: [null, 2, undefined, {a: /ab/gi}]}},
));
