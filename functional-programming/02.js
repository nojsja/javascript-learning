/**
 * 高阶函数
 */

// 对象类型检测函数 //
// 数组
function isArray(value) {
  return Object.prototype.toString.call(value) == "[object Array]";
}
// 函数
function isFunction(value) {
  return Object.prototype.toString.call(value) == "[object Function]";
}
// 正则对象
function isRegExp(value) {
  return Object.prototype.toString.call(value) == "[object RegExp]";
}

// 作用域安全的构造函数 //
{
  // not safe
  function Person(name, age) {
    this.name = name;
    this.age = age;
  }

  // safe
  function Person2(name, age) {
    if (this instanceof Person2) {
      this.name = name;
      this.age = age;
    }else {
      return new Person2(name, age);
    }
  }
}

// 惰性载入函数 //
{
  // 01. ajax对象获取动态改变函数自身
  function createXHR() {
    if (typeof XMLHttpRequest != "undefined") {
      createXHR = function () {
        return new XMLHttpRequest();
      };
    } else if (typeof ActiveXObject !== "undefined") {
      createXHR = function () {
        if (typeof arguments.callee.activeXString != "string") {
          var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
            "MSXML2.XMLHttp"], i, len;
          for (i = 0, len = versions.length; i < len; i++) {
            try {
              new ActiveXObject(versions[i]);
              arguments.callee.activeXString = versions[i];
              break;
            } catch (e) {

            } finally {

            }
          }
        }

        return new ActiveXObject(arguments.callee.activeXString);
      };

    } else {
      createXHR = function () {
        throw new Error("No XML object avaliable");
      };
    }
  }

  // 02. ajax对象获取闭包
  const createXHR2 = (function () {
    if (typeof XMLHttpRequest != "undefined") {
      return function () {
        return new XMLHttpRequest();
      };
    } else if (typeof ActiveXObject != "undefined") {
      return function () {
        if (typeof arguments.callee.activeXString != "string") {
          var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
            "MSXML2.XMLHttp"], i, len;
          for (i = 0, len = versions.length; i < len; i++) {
            try {
              new ActiveXObject(versions[i]);
              arguments.callee.activeXString = versions[i];
              break;
            } catch (e) {

            } finally {

            }
          }
        }

        return new ActiveXObject(arguments.callee.activeXString);
      };

    } else {
      return function () {
        throw new Error("No XML object avaliable.");
      };
    }
  })();

}

// 函数绑定 //
{
  // 函数柯里化有增强版bind
  function bind(context, fn) {
    return function () {
      fn.apply(context, arguments);
    };
  };

  // 测试
  let test = {
    message: "i am inner",
    show: function () {
      console.log(this.message);
    }
  };
  test.show();  // i am inner
  let test2 = test.show;
  test2();  // undefined
  bind(test, test.show)();  // i am inner
}

// 函数柯里化 //
{
  function curry(fn) {
    // 外层函数参数
    var args = Array.prototype.slice.call(arguments, 1);

    return function () {
      // 注意arguments是个伪数组
      var innerArgs = Array.prototype.slice.call(arguments);
      var finalArgs = args.concat(innerArgs);
      return fn.apply(null, finalArgs);
    };
  }

  let test = function (a, b) {
    console.log(a + b);
  };
  let curryAdd = curry(test, 3);
  curryAdd(4);  // 7
  curryAdd(3);

  // 增强版本bind
  // 例如在绑定event事件函数时可以传入event和其它参数
  function bind(context, fn) {
    var args = Array.prototype.slice.call(arguments, 2);
    return function () {
      var innerArgs = Array.prototype.slice.call(arguments);
      var finalArgs = innerArgs.concat(args);

      fn.apply(context, finalArgs);
    };
  }
}

// 防篡改对象 //
{
  // 不可扩展对象
  // 检测扩展性 Object.isExtensible(obj)
  let person = {
    name: "Alice"
  };
  Object.preventExtensions(person);
  person.age = 12;
  console.log(person.age);  // undefined

  // 密封的对象 -- 不可扩展且不可配置属性
  // 检测密封性 Object.isSealed(obj)
  let person2 = {
    name: "Johnson"
  };
  Object.seal(person2);
  delete person2.name;
  console.log(person2.name);  // Johnson
  person2.age = 12;
  console.log(person2.age); // undefined

  // 冻结的对象 -- 不可扩展不可配置不可重写
  // 检测冻结性 Object.isFrozen()
  let person3 = {
    name: "Atom"
  };
  Object.freeze(person3);
  delete person3.name;
  console.log(person3.name);  // Atom
  person3.name = "Atomi";
  console.log(person3.name);  // Atom
  person3.age = 14;
  console.log(person3.age); // undefined
}

//
//
//
//
//
