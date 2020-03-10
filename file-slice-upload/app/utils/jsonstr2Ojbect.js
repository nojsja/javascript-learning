/**
* @name: jsonstr2Object
* @description: 去除shell返回的json字符串内容的最后一个','符号，并转化成对象
*/
function jsonstr2Object(_str) {
  let str = _str;

  try {
    str = str.substr(0, (str.length - 1));
    str = `{${str}}`;
    str = JSON.parse(str);
  } catch (e) {
    str = '{}';
    console.error(e);
  }

  return str;
}

export default jsonstr2Object;
