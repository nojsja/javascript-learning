/**
* @name: 获取多个数组的交集
* @description: // ip字符串智能转换 10.0.6.1-10,11,12,10.0.6.13 支持三种格式任意组合
* @author: nojsja
*/

/**
 * ineresect [求多个数组的交集]
 * @param  {...Array} args 
 */

 function intersect(...args) {
  if (args.length === 0) {
    return [];
  }
  if (args.length === 1) {
    return args[0];
  }
  return args.reduce((prev, next) => {
    return prev.filter((i) => next.indexOf(i) > -1);
  });
}
