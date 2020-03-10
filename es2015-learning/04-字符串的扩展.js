/**
 * 字符串的扩展
 */

// 字符串的遍历器接口 //
{
  for(let codePoint of "string") {
    console.log(codePoint);
  }
}

// 字符串查找方法 //
{
  const char1 = "string";
  const char2 = "str";
  const char3 = "ing";

  // es5
  console.log(char1.indexOf(char2));
  // es6
  console.log(char1.includes(char2)); // true
  console.log(char1.startsWith(char2)); // true
  console.log(char1.endsWith(char3)); // true
  // 支持第二个参数表示开始搜索的位置
  console.log(char1.startsWith("ing", 3));  // true
}

// 字符串重复次数 //
{
  const char = "ab";
  console.log(char.repeat(3));  // ababab
  console.log(char.repeat(0));  // ''
  // 小数取整, 参数是0到-1之间的小数等同于0
  console.log(char.repeat(2.1));  // abab
  console.log(char.repeat(-0.5));  // ''
  // 参数为其它的小数和infinity则会报错
  try {
    console.log(char.repeat(-4)); // RangeError
    console.log(char.repeat(infinity)); // RangeError
  } catch (e) {
    console.log(e);
  } finally {

  }

  // 参数是字符串的话会转换为数字
  console.log(char.repeat('sdf'));  // ''
  console.log(char.repeat('2'));  // abab

}

// 模板字符串 //
{
  const name = "杨伟";
  const mchar = `我的名字是:${name}`;
  // 模板字符串表示单行字符
  console.log(`The Javascript '\n' is a line-feed`);
  // 多行字符串中所有的空格和缩进都会被保留到输出中
  console.log(`sdfsdf
  sdfsdf sdf `);
  // 大括号内可放入任意的JavaScript表达式，函数和属性引用
  function test() {
    return 'test fn';
  }
  let obj = {a: 1, b: 2};
  console.log(`function: ${test()}`); // function: test fn
  console.log(`${1+2+2}`);  // 5
  console.log(`${obj.a}`);
  // 如果大括号中的值不是字符串将会按照一般的规则转换，比如对象会调用自身的toString方法
  // 未声明的变量会报错，字符串会原样输出

  // 对模板字符串的引用
  // (1)
  let str = "let name = 'Johnson'; return " + "`hello ${name}!`";
  let func1 = new Function('fun1', str);
  console.log(func1()); // hello Johnson
  // (2)
  let str2 = "(name) => (`hello ${name}`)";
  let fun2 = eval.call(null, str2);
  console.log(fun2("Johnson"));  // hello Johnson
}
//
//
//
//
//
//
//
//
//
