/* -----------------------------------------------------------------------------
  js浅复制: 应用类型只复制第一层有信用，常规类型直接复制值
  数据类型：object - array - boolean - number - date - function - string - null/undefined
----------------------------------------------------------------------------- */

function shallowClone(data) {
  var base;

  if (!data || !(typeof data === 'object')) {
    throw new Error('argument of shallowClone must be an object!');
  } else {
    base = Object.prototype.toString.call(data) === '[object array]' ? [] : {};
  }

  for (var attr in data) {
    if (data.hasOwnProperty(attr)) {
      base[attr] = data[attr];
    }
  }

  return base;
}

/* ------------------- TEST ------------------- */
var a = [1, 2, {}];
var b = shallowClone(a);
console.log('shallowClone test: ', b[2] == a[2]);
