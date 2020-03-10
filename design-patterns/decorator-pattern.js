/* -----------------------------------------------------------------------------
  装饰者模式：
  对原始操作对象进行层层封装，动态地增加对象的职责，且不改变原始对象自身。
  装饰者模式和代理模式有一定的相似性，最重要的区别在于他们的意图和设计目的。代理模式的目的是
  当直接访问本体不方便或者不符合需要时，为这个本体提供一个替代者，本体定义了关键的功能，而代理模式
  则控制对本体的访问或是对本体的访问做预处理。而装饰者模式的作用就是为对象动态地添加行为，换句话说
  代理模式体现一种代理和本体之间的关系，这种关系是静态的，已经被预先确定，而装饰者模式使用于一开始
  不确定对象的全部功能，以黑盒似的将对象的功能表达做层层包裹，所以如果层次太多，会对性能造成影响。
----------------------------------------------------------------------------- */

/* ************************* 传统面向对象语言的装饰者 ************************* */
(function () {

  var Plane = function () {};
  Plane.prototype.fire = function () {
    console.log('发射普通子弹');
  };

  // 发射导弹装饰类
  var MissileDecorator = function (plane) {
    this.plane = plane;
  };
  MissileDecorator.prototype.fire = function () {
    this.plane.fire();
    console.log('发射导弹');
  };

  // 发射原子弹装饰类
  var AtomDecorator = function (plane) {
    this.plane = plane;
  };
  AtomDecorator.prototype.fire = function () {
    this.plane.fire();
    console.log('发射原子弹');
  };

})();

/* ************************* JavaScript的装饰者 ************************* */

// 直接改造原有对象
(function functionName() {

  var plane = {
    fire: function () {
      console.log('发射普通子弹');
    }
  };

  // 发射导弹
  var missileDecorator = function () {
    console.log('发射导弹');
  };

  // 发射原子弹
  var atomDecorator = function () {
    console.log('发射原子弹');
  };

  // 先保存引用，再修改引用
  var fire1 = plane.fire;
  plane.fire = function () {
    fire1();
    missileDecorator();
  };

  var fire2 = plane.fire;
  plane.fire = function () {
    fire2();
    atomDecorator();
  };

})();

/* ************************* 侵入型更改原型方法 ************************* */
(function functionName() {

  // 函数执行前
  Function.prototype.before = function (beforeFn) {
    // 保存对原始函数的引用
    var _self = this;

    return function () {
      // 里层this是调用function时的执行环境
      beforeFn.apply(this, arguments);
      _self.apply(this, arguments);
    };
  };

  // 函数执行后
  Function.prototype.after = function (afterFn) {
    // 保存对原始函数的引用
    var _self = this;

    return function () {
      // 里层this是调用function时的执行环境
      afterFn.apply(this, arguments);
      _self.apply(this, arguments);
    };
  };

  // 使用方式
  document.getElementById = document.getElementById.before(function () {
    console.log('正在执行getElementById');
  });
  var button = document.getElementById('buttonId');
})();
