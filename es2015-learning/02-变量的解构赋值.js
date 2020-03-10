/**
 * 变量的解构赋值的用途
 */

// 交换变量的值 //
{
  [x, y] = [y, x];
}

// 从函数返回多个值 //
{
  function fn1() {
      return [1, 2, 3];
  }
  var [a, b, c] = fn1();

  function fn2() {
    return {
      foo: 1,
      bar: 2
    }
  }
  var { foo, bar } = fn2();
}

// 函数参数的定义 //
{
   function fn1([a, b, c]) { };
   fn1([1, 2, 3]);

   function fn2({a, b, c}) { };
   fn2({a: 1, b: 2, c: 3});
}

// 提取json数据 //
{
  var jsonData = {
    id: 42,
    status: "ok",
    data: [1, 2, 3]
  };
  var {id, status, data:number} = jsonData;
  console.log(id, status, number);
}

// 函数参数的默认值 //
{
  function toDo(param=1, param2=2, param3=3) {

  }
}

// 遍历map解构,map具有iterator接口 //
{
  var map = new map();
  map.set("first", "hello");
  map.set("second", "world");
  for(let [key, value] of map){
    console.log(key + ' is ' + value);
  }
  for(let [key] of map) {
    console.log('key' + key);
  }
  for(let [, value] of map){
    console.log('value' + value);
  }
}

// 输入模块的指定方法 //
{
  const {a, b} = require('...');
}
