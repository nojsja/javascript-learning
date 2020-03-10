import { newBlock } from './public';

/* ============================================================================
  Arity
  函数所需的参数个数。来自于单词 unary, binary, ternary 等等。这个单词是由 -ary 与 -ity
  两个后缀组成。例如，一个带有两个参数的函数被称为二元函数或者它的 arity 是2。它也被那些更喜欢
  希腊词根而非拉丁词根的人称为 dyadic。同样地，带有可变数量参数的函数被称为 variadic，
  而二元函数必须给出两个且只有两个参数，见下文的.
  柯里化(Currying) 和 偏应用函数(Partial Application)
============================================================================= */
newBlock('获取函数声明的参数个数', () => {
  let sum = (a, b) => a + b;
  console.log('函数参数个数: ' + sum.length);
});

/* ============================================================================
  高阶函数 Higher-Order Functions (HOF)\
  一个函数，以函数为参数 或/和 返回一个函数。
============================================================================= */
newBlock('高阶函数', () => {
  const filter = (predicate, xs) => xs.filter(predicate);
  // 注意item 需要被向上转型
  const is = (type) => (item) => Object(item) instanceof type;

  console.log('所有数字类型的数据: ', filter(is(Number), [1, 2, null]));
});

/* ============================================================================
  偏应用函数 Partial Application
  偏应用一个函数意思是通过预先填充原始函数的部分(不是全部)参数来创建一个新函数。
  偏应用函数应用通过对复杂的函数填充一部分数据来构成一个简单的函数。柯里化(Curried) 通过
  偏应用函数实现。
============================================================================= */
newBlock('偏应用函数', () => {
  let partial = (fn, ...args) =>
    (...moreArgs) => fn(...args, ...moreArgs);

  let add = (a, b, c) => a + b + c;

  let plus = partial(add, 1, 2);
  console.log('plus: ', plus(3));
});
/* ============================================================================
  Currying
  将多个参数的函数(多元函数) 转换为 一元函数的过程。
  每当函数被调用时，它仅仅接收一个参数并且返回带有一个参数的函数，直到所有的参数传递完成。
============================================================================= */
newBlock('函数柯里化', function () {
  let sum = (a, b) => a + b
  let curriedSum = (a) => (b) => a + b

  console.log(curriedSum(40)(2)); // 42.

  add2 = curriedSum(2) // (b) => 2 + b

  console.log(add2(10)); // 12
});

/* ============================================================================
  闭包 Closure
  闭包是访问其作用域之外的变量的一种方法。正式一点的解释，闭包是一种用于实现词法作用域的命名绑定的
  技术。它是一种用环境存储函数的方法。
  闭包是一个作用域，在这个作用域能够捕获访问函数的局部变量，即使执行已经从定义它的块中移出。
  即，它们允许在声明变量的块执行完成之后保持对作用域的引用。
  const addTo = x => y => x + y
  var addToFive = addTo(5)
  addToFive(3) // returns 8

  函数 addTo() 返回一个函数（内部调用 add() ），将它存储在一个名为 addToFive 的变量中，
  并柯里化(Curried)调用，参数为 5 。

  通常，当函数 addTo 完成执行时，其作用域与局部变量 add，x，y 不可访问。但是，
  它在调用 addToFive() 时返回 8。这意味着即使代码块执行完成后，函数 addTo 的状态也被保存，
  否则无法知道 addTo 被调用为 addTo(5)，x 的值设置为 5。

  词法作用域是能够找到 x 和 add 的值的原因 – 已完成执行的父级私有变量。这就称为 Closure(闭包) 。

  堆栈伴随着函数的词法作用域存储在父对象的引用形式中。这样可以防止闭包和底层变量被当做垃圾回收
  （因为至少有一个实时引用）。

  Lambda Vs Closure(闭包) ：lambda 本质上是一个内联定义的函数，而不是声明函数的标准方法。
  lambda 经常可以作为对象传递。

  闭合是一个函数，通过引用其函数体外部的字段来保持对外部变量的引用。
============================================================================= */
newBlock('闭包Closure', function () {
  let addTo = x => y => x + y
  let addToFive = addTo(5)
  console.log(addToFive(3)) // returns 8
});

/* ============================================================================
  自动柯里化 Auto Currying
  将一个将多个参数的函数转换为一个参数的函数，如果给定的参数数量少于正确的参数，则返回一个函数，
  该函数将获得其余的参数。当函数得到正确数量的参数时，它就会被求值。
  lodash 和 Ramda 都有一个 curry 函数，使用的就是这种工作方式。
  const add = (x, y) => x + y
  const curriedAdd = _.curry(add)
  curriedAdd(1, 2) // 3
  curriedAdd(1) // (y) => 1 + y
  curriedAdd(1)(2) // 3
============================================================================= */
newBlock('自动柯里化', function () {
  let autoCurryAdd = function(a, b, c) {
    // 函数应该接受的参数个数
    let length = autoCurryAdd.length;
    // 函数在指定个数的参数下应该执行的逻辑
    let action = (a, b, c) => {
      console.log('result of autoCurryAdd: ', a + b + c);
    };
    // 传参
    let args = arguments;

    if (arguments.length == length) {
      action.apply(null, args);
    }

    // 递归调用
    return function(...args2){
      return  autoCurryAdd(...args2, ...args);
    };

  };

  autoCurryAdd(1, 2, 3);
  autoCurryAdd(1)(2)(3);
  autoCurryAdd(1, 2)(3);

});

newBlock('自动柯里化闭包升级版', function () {

  let autoCurryAdd = (function() {

    // 函数在指定个数的参数下应该执行的逻辑
    let action = (a, b, c) => {
      console.log('result of autoCurryAdd: ', a + b + c);
    };
    // 函数应该接受的参数个数
    let length = action.length;

    return function () {
      // 传参
      let args = arguments;

      if (arguments.length == length) {
        action.apply(null, args);
      }

      // 递归调用
      return function(...args2){
        return  autoCurryAdd(...args2, ...args);
      };
    }

  })();

  autoCurryAdd(1, 2, 3);
  autoCurryAdd(1, 2)(3);
  autoCurryAdd(1)(2)(3);

});

/* ============================================================================
  函数合成 Function Composition
  将两个函数合成在一起构成第三个函数，其中一个函数的输出是另一个函数的输入, 函数输出重定向
============================================================================= */
newBlock('函数合成', function () {
  const compose = (fnOutter, fnInner) => (args) => fnOutter(fnInner(args));
  console.log( compose( (val) => val.toString(), Math.floor)(121.1111111) );
  console.log( typeof compose( (val) => val.toString(), Math.floor)(121.1111111) );
});


/* ============================================================================
  Continuation
  在一个程序执行的任意时刻，尚未执行的代码称为 Continuation。
  Continuation 在异步编程中很常见，当程序需要等待接收数据才能继续执行。
  一旦接收到数据，请求响应通常会被传递给程序的剩余部分，这个剩余部分就是 Continuation。
============================================================================= */
newBlock('Continuation', function () {
  const printAsString = (num) => console.log(`Given ${num}`)

  const addOneAndContinue = (num, cc) => {
    const result = num + 1
    cc(result)
  }
  addOneAndContinue(2, printAsString) // 'Given 3'
});

/* ============================================================================
  纯函数 Purity
  如果返回值仅由其输入值决定，并且不产生副作用，那么这个函数就是纯函数。
============================================================================= */
newBlock('纯函数', function () {
  // 以下代码不是纯函数：
  let obj = {};
  obj.name = 'Brianne'

  let greet = () => `Hi, ${obj.name}`

  console.log(greet()); // "Hi, Brianne"
  // 上述示例的输出基于存储在函数外部的数据…

  let greeting;

  greet = (name) => {
    return greeting = `Hi, ${name}`
  }

  console.log(greet('Johnson'));
  // greeting == "Hi, Brianne"
  // 而这个示例则是修改了函数外部的状态。
});

/* ============================================================================
  副作用 Side effects

  函数或表达式如果被认为具有副作用，那么除了返回值之外，它可以与外部可变状态（读取或写入）进行交互。
============================================================================= */
newBlock('副作用side effects', function () {
  const differentEveryTime = new Date()
  console.log('IO is a side effect!')
});

/* ============================================================================
  幂等 Idempotent
  将一个函数重新应用其结果，如果产生的结果是相同的，那么该函数是幂等的。
  A function is idempotent if reapplying it to its result does not produce a different result.
  f(f(x)) ≍ f(x)
============================================================================= */
newBlock('幂等idempotent', function () {
  console.log( Math.abs(Math.abs(10)) == Math.abs(10) );
});

/* ============================================================================
  Point-Free Style
  定义函数时，没有显式地标识所使用的参数。这种风格通常需要 currying(柯里化) 或 高阶函数。
  也叫 Tacit programming。

  incrementAll 明确的使用了参数 numbers，所以它是非 points-free 风格。 incrementAll2 连接函数与值，并不提及它的参数。所以 是 points-free 风格.
  Point-Free 风格的函数就像平常的赋值，不使用 function 或者 =>。
============================================================================= */
newBlock('Point-Free', function () {
    // 给定
  const map = (fn) => (list) => list.map(fn)
  const add = (a) => (b) => a + b

  // 然后
  // 非 points-free - `numbers` 是一个明确的参数
  const incrementAll = (numbers) => map(add(1))(numbers)

  // Points-free - `list` 显式地标识
  const incrementAll2 = map(add(1))
});

















//
