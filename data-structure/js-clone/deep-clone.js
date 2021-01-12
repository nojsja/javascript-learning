/**
* deep clone
* @param  {[type]} parent object 需要进行克隆的对象
* @return {[type]}        深克隆后的对象
*/

function deepClone(data) {

  const map = new WeakMap();

  const getRegExp = re => {
    let flags = '';
    if (re.global) flags += 'g';
    if (re.ignoreCase) flags += 'i';
    if (re.multiline) flags += 'm';

    return flags;
  };
  
  const isObjType = (obj, type) => {
    if (typeof obj !== 'object') return false;
    const typeString = Object.prototype.toString.call(obj);
    return typeString === `[object ${type}]`;
  };

  const _clone = (target) => {
    if (target === null) return null;
    if (target !== target) return NaN;
    if (!isObjType(target)) return target;
    
    let base;

    // 对正则对象做特殊处理
    if (isObjType(target, 'RegExp')) return new RegExp(target.source, getRegExp(target));
    // 对Date对象做特殊处理
    if (isObjType(target, 'Date')) return new Date(target.getTime());

    base = isObjType(target, 'Array') ? [] : {};

    // 处理循环引用
    if (map.get(target)) return map.get(target);
    map.set(target, base);
    
    for (let i in target) {
      base[i] = _clone(target[i]);
    }
    
    return base;
  };

  return _clone(data);
};

const a = {a: 1, b: {v: 2}, c: /[a-b]/gim, d: [1,2,3,4], f: new Date()};
a.e = a;
const b = deepClone(a);

console.log(b, b.b === a.b, b.c === a.c, b.c === a.d, b.e === b);
