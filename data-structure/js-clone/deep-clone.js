/* -----------------------------------------------------------------------------
  js浅复制: 应用类型只复制第一层有信用，常规类型直接复制值
  数据类型：object - array - boolean - number - date - function - string - null/undefined
----------------------------------------------------------------------------- */

/* ------------------- 深复制 ------------------- */
var deepClone =  (function () {

  // key step
  function step(data) {
    var nData;

    if ( Object.prototype.toString.call(data) === '[object Array]') {
      arrayClone(nData = [], data);
    } else if (Object.prototype.toString.call(data) === '[object Object]') {
      objectClone(nData = {}, data);
    } else {
      nData = normalClone(data);
    }

    return nData;
  }

  // get reg condition
  function getRegExp(re) {
    var flags = '';
    if (re.global) flags += 'g';
    if (re.ignoreCase) flags += 'i';
    if (re.multiline) flags += 'm';
    return flags;
  };

  // array clone
  function arrayClone(base, target) {
    for (var i = 0; i < target.length; i++) {
      base[i] = step(target[i]);
    }
  };

  // object clone
  function objectClone(base, target) {
    var keys = Object.keys(target);
    for (var i = 0; i < keys.length; i++) {
      base[ keys[i] ] = step(target[ keys[i] ]);
    }
  };

  // simple clone
  function normalClone(target) {
    if ( Object.prototype.toString.call(target) === '[object RegExp]' ) {
      var reg = new RegExp(target.source, getRegExp(target));
      target.lastIndex && (reg.lastIndex = target.lastIndex);

    } else if( Object.prototype.toString.call(target) === '[object Date]' ) {
      target = new Date(target.getTime());
    }

    return target;
  };

  return step;

})();

/* ------------------- TEST ------------------- */
var a = [1, 2, {}, /(1|2)/gi];
var b = deepClone(a);
b.forEach(function (item, i) {
  console.log(item, item === a[i]);
});
