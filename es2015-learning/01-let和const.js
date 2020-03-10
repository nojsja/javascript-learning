/**
 * let和const命令
 */

// let的作用范围仅限于块级且不存在变量提升 //
{
  {
    let a = 10;
    var b = 1;
  }
  a // ReferenceError:a is not defined
  b // 1
}

{
  console.log(foo); // ReferenceError
  let foo = 2;
}


// let和var混用时会存在暂时性死区，es6规定块级会对let一开始就声明的变量形成封闭作用域 //
// 相当于块级内的作用域会覆盖外部作用域的声明，但是let又不存在变量提升 //
{
  var tmp = 123;
  {
    console.log(tmp); // ReferenceError
    let tmp = 111;
  }

  function bar(x = y, y = 2) { // ReferenceError
    return [x, y];
  }
  bar();
}

// 不允许重复声明 //
function norepeat() {
  let a = 10;
  let a = 2; // Error
}
function fun(arg) {
  let arg; // Error
}
function fun2(arg) {
  {
    let arg; // Pass
  }
}

// 块级之间声明的相同变量或函数互不干扰 //
function fn() {
  console.log('i am outside.');
}
(function () {
  if(false){ // es5中不管if内是否执行，函数声明都会被提升
    function fn() {
      console.log('i am inside.');
    }
  }
  fn(); // i am outside
})();

// const命令用来声明常量，一旦声明就不能改变 //
// const只能被立即初始化，且声明不能提升，不可重复声明 //
{
  const PI = 3.145;
  PI = 3; // TypeError: PI is read only
  const MAX; // SysntaxError
}

// const声明的常量属性可以改变但是不能改变变量初始引用值 //
{
  const foo = {};
  foo.attr = 12;
  console.log(foo.attr);
  foo = {}; // TypeError
}

// 跨模块的常量 //
// constants.js模块
{
  export const A = 1;
  export const B = 2;
  export const C = 3;
}
// test.js模块
{
  import * as constants from './constants.js';
  console.log(constants.A); // 1
  console.log(constants.B); // 2
}
// test2.js模块
{
  import {A, B} from './constants.js';
  console.log(A);
  console.log(B);
}

// 全局变量的声明 //
var globalA = 1;
console.log(window.globalA); // 1
let globalB = 2;
console.log(window.globalB); // undefined
