/*
  终极继承方法 -- 寄生组合式继承
  所谓寄生组合式继承， 即通过借用构造函数来继承属性， 通过原型链的混成形式来继承方法。
  结合了寄生式继承和构造函数继承，同时改善了 组合式继承的 父类构造函数执行两遍的缺点，是最佳的解决方案。
*/

/* ------------------- 取得父类原型和修改原型指向 ------------------- */
function inheritPrototype (subObject, superObject){

  // 通过过度函数创建实例对象的方法
  function inheritObject (obj){
      // 声明干净的过度函数
      function F(){ }
      // 获取原型链
      F.prototype = obj;
      // 继承属性的过度类实例对象
      return new F();
  }

  // 此步中重写子类原型导致了子类实例对象不是子类的实例instanceof 为false
  // 使用寄生式继承来继承超类型的原型，然后再将结果指定给子类型的原型
  var o = inheritObject(superObject.prototype);
  // 手动更改子类的原型指向和子类的构造函数
  // 一般原型里面的constructor都是构造函数
  o.constructor = subObject;
  // 这样子子类的原型更改不会影响到父类原型的更改
  // 原型对象的实例只提供了访问原型属性的接口，并不能直接修改原型
  subObject.prototype = o;
}

/* ------------------- 父类 ------------------- */
function superObject(name) {
    this.name  = name;
}

// 父类共享的属性方法
superObject.prototype.getName = function(){
    return this.name;
};

/* ------------------- 子类 ------------------- */
function subObject(name, time){
    // 获得父类构造函数里的属性
    superObject.call(this, name);
    // 子类扩展其它属性
    this.time = time;
}

/* ------------------- 共享原型链 ------------------- */
inheritPrototype(subObject, superObject);
// 或使用Object.create进行原型对象复制
//subObject.prototype = Object.create(superObject.prototype);

/* ------------------- 扩展原型共享的方法 ------------------- */
subObject.prototype.getTime = function(){
    return this.time;
};
