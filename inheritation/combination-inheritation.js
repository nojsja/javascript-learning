/*
  将优点为我所用 -- 组合式继承：
  组合式继承结合了构造函数继承和类式继承的优点,并且子类的更改不会影响到父类，
  子类通过指定原型是父类的实例对象，实现对父类原型链的共享，同时子类的构造函数
  同样会复制父类的构造函数在自己的上下文里执行，所以可以传入参数初始化父类属性。
  在子类构造里通过this['attr']也可以派生子类的新添属性而不会覆盖父类属性。
  组合式继承是目前比较好的方法，只是父类的构造函数会在子类里面执行两次。
*/

// 父类构造函数
function superObject(name) {

    this.name  = name;
}

// 父类共享的属性方法
superObject.prototype.getName = function(){

    return this.name;
};

function subObject(name, time){

    // 复制父类构造函数并执行this绑定
    superObject.call(this, name);
    // 扩展其它属性
    this.time = time;
}

// 共享原型链
subObject.prototype = new superObject();

// 子类的共有方法
subObject.prototype.getTime = function(){

    return this.time;
};


var newSubObject = new subObject("nojsja", "1995");
console.log(newSubObject.getName() + " born in " + newSubObject.getTime());
