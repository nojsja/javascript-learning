/**
* @name: ip字符串只能自动转换
* @description: // ip字符串智能转换 10.0.6.1-10,11,12,10.0.6.13 支持三种格式任意组合
* @author: nojsja
*/

/**
 * [ipsParse description]
 * @param  {[String]} ipstr [ip复杂字符串]
 * @return {[Array]}  iparray   [ip数组]
 */
export function ipsParse(ipstr) {
  const iparray = ipstr.split(',').map(s => trim(s));
  for (let i = 0; i < iparray.length; i += 1) {
    if (iparray[i].split('.').length === 4) {
      if (iparray[i].split('.')[3].split('-').length === 2) { // 区段格式
        const start = iparray[i].split('.')[3].split('-')[0];
        const end = iparray[i].split('.')[3].split('-')[1];
        let pre = iparray[i].split('.');
        pre.pop();
        pre = pre.join('.');
        iparray.splice(i, 1);
        for (let j = end; j >= start; j -= 1) {
          iparray.splice(i, 0, `${pre}.${j}`);
        }
      } else { // 完整格式
        continue;
      }
    }
    // 单字格式
    if (iparray[i - 1] && iparray[i] && iparray[i].split('.').length === 1) {
      const tarray = iparray[i - 1].split('.');
      tarray.pop();
      iparray[i] = `${tarray.join('.')}.${iparray[i]}`;
    }
  }

  return iparray;
}
