function startLine() {
  console.log('___________start___________');
}
function endLine() {
  console.log('____________end____________');
}

{
  startLine();
  // 函数参数的默认值得
  var fn1 = function(x, y) {
    y = y || ' world';
    console.log(x + y);
  }
  fn1('hello', ' world');
  fn1('hello');
  // y参数的值被转换成false后未被识别
  fn1('hello', '');

  // es5改进
  fn1 = function(x, y) {
    if (arguments.length == 1 || typeof y === 'undefined') {
      y = 'world';
    }

    console.log(x + y);
  }
  fn1('hello', 'world2');
  fn1('hello', '');

  // 使用es2015默认参数
  fn1 = function (x = 'hello', y = ' world3') {
    console.log(x + y);
  }
  fn1();

  // 使用函数解构
  // 调用函数时同时传入参数也应该时对象
  fn1 = function ({ x, y = ' world4' }) {
    console.log(x + y);
  }
  fn1({ x: 'hello' });

  // 函数参数对象的解构和函数对象参数的默认值
  // 设置了参数默认值之后,不能省略第二个参数
  function m0(str, { x = 0, y = 0 }) {
    console.log('不具有默认参数,只有参数对象解构:');
    console.log('m0: ' + [x, y]);
  }
  function m1({ x = 0, y = 0 } = {}) {
    console.log('具有参数对象解构,并且参数对象有默认值为空对象');
    console.log('m1: ' + [ x, y ]);
  }
  function m2({ x, y } = { x: 0, y: 0}) {
    console.log('具有参数对象解构, 解构没有默认值, 并且参数对象有不为空的对象');
    console.log('m2: ' + [ x, y ]);
  }

  try {
    m0('dkd');
  } catch (e) {
    console.log(e);
  }

  m1({}); // 输出0,0
  m1({x: 1}); // 输出1,0

  m2({}); // 输出undefined,undefined
  m2({x: 1}); // 输出1, undefined

  // 函数的参数为变量或是外层函数
  let foo = 'm4-foo';
  // 参数中的匿名函数读取外部已经声明的foo变量
  function m4(x = () => foo) {
    let foo = 'm4-foo-inner';
    console.log( 'm4' + x() );
  }
  m4();
  // 函数参数是变量,该变量的作用域查找遵循规则 从内层函数 -> 外层作用域
  let x = 'm5-x';
  function m5(x, y = x) {
    console.log('m5' + y);
  }
  m5('m5-x-inner');
  // 如果参数变量函数内还未声明,那么将读取外部的作用域的取值
  function m6(y = x) {
    x = 'm6-x-inner';
    console.log('m6 ' + y);
  }
  m6();

  endLine();
}


{
  startLine();
  // 函数的rest参数用于替代arguments
  // add函数的args变量会指向一个包含所有参数的数组
  // ...args后面不能再接参数,否则会报错!
  function add(...args) {
    let result = 0;
    for(let item in args) {
      result += Number(item);
    }
    console.log('add function(use rest): ' + result);
  }
  add(1, 2, 3, 4);

  // 扩展运算符 ...[数组] 相当于...变量的逆运算
  // 扩展参数可以和普通参宿一起共用
  console.log('扩展运算符: ');
  console.log(...[1, 2, 3, 4]);
  console.log(...[1, 2], 1, 2, ...[1]);
  // 因此可以用来替代数组的apply调用
  Math.max.apply(null, [1, 2, 3]);
  Math.max(...[1, 2, 3]);
  Array.prototype.push.apply([1, 2, 3], [4, 5]);
  [1, 2, 3].push(...[4, 5]);
  // 扩展运算符的运用 -- 合并数组
  [1, 2].concat([3, 4]);
  [1, 2, ...[3, 4]];
  // 扩展运算符与解构结合起来用于生成新的数组
  // 用于数组赋值时...var只能放在末尾
  console.log('扩展运算符生成新的数组: ');
  let testArray1 = testArray2 = [1, 2, 3, 4];
  let a = testArray1[0];
  let b = testArray1.slice(1);
  console.log(a, b);
  let [c, ...d] = testArray2;
  console.log(c, d);
  // 扩展操作符将字符串按字符转化为数组
  console.log('扩展转化字符串： ');
  console.log([...'hello world']);
  // 任何类数组的对象都可以通过扩展运算符转化为数组
  /*
  let nodeList = document.querySelector('div');
  [...nodeList]
   */

  //  Map, Set 和 Generator 函数都可以使用扩展运算符、
  //  扩展运算符内部调用的是Iterator借口，因此只要具有Iterator借口的对象都能使用
  let map = new Map([
    [1, 'one'],
    [2, 'two'],
    [3, 'three']
  ]);
  let mapKey = [...map.keys()];
  console.log('mapKey: ' + mapKey);
  // Generator函数运行后返回一个遍历器对象，也能使用扩展
  var go = function *() {
    yield 1;
    yield 2;
    yield 3;
  };
  console.log('generator: ' + [...go()]);

  endLine();

}



{
  startLine();
  // 箭头函数 //
  let fn = v => v; // 与以下声明等同
  let fn2 = function (v) {
    return v;
  }
  // 当函数没有参数或是有多个参数时需要使用圆括号
  var fn3 = () => 5;
  var fn4 = (num1, num2) => num1 + num2;
  // 如果箭头函数体内语句多余一条需要用大括号括起来
  // 直接返回一个对象时需要用圆括号将对象括起来
  var fn5 = () => {
    console.log(1);
    console.log(2);
  };
  var fn6 = () => ({x: 1});

  // 箭头函数与变量解构结合使用
  var fn7 = ({x, y}) => x + y; // 与以下声明等同
  var fn8 = function (args) {
    return args.x + args.y;
  };
  // rest参数和箭头函数结合
  var fn8 = (...nums) => nums; // nums是数组
  console.log('rest and => ' + fn8(1, 2, 3, 4));
  const headTail = (head, ...tail) => [head, tail];
  console.log('headTail: ' + headTail( ['a', 'b', 'c', 'd'] )); // [[a], [b, c, d]]

  // 箭头函数使用注意事项 //
  // 1.函数体内的this对象就是定义时所在的对象，而不是使用时所在的对象， this的指向时固定的。
  // 2.箭头函数不能够作为构造函数。
  // 3.不可以使用arguments对象，但是可以用rest参数替代。
  // 4.不可以使用yield命令，箭头函数不能用作generator函数。
  // 5.箭头函数this指向的固定化不是因为箭头函数内有独立的this绑定机制，而是箭头函数没有this对象，
  //   默认使用外层的this对象
  // 6.yinwei

  function foo() {
    setTimeout( () => {
      console.log('foo id: ' + this.id);
    }, 500);
  }
  foo.call( {id: '100'} );



  endLine();
}





//
