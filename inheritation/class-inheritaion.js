/*
  子类的原型对象 -- 类式继承的缺点：
    1. 子类的原型是父类的实例对象，因为父类的所有属性都是引用类型

    2. 继承是通过实例化父类再赋值给子类的原型，所以创建子类对象的时候无法传参到父类构造函数，导致父类构造函数不能被初始化，
    只能在子类的构造函数中初始化子类的相关属性。
*/


// 父类
function superObject(attr){

    this.superAttr = attr;
}

// 父类的原型
superObject.prototype.getSuperValue = function(){

    return this.superAttr;
};

// 子类1
function subObject(attr) {
    this.subAttr = attr;
}

// 子类2
function subObject2(attr) {
  this.subAttr = attr+'2';
}

// 类继承
subObject.prototype = new superObject("super");
subObject2.prototype = new superObject("super2");

// 注意顺序，原型属性会被原型表达式给覆盖
subObject.prototype.getSubValue = function() {

    return this.subAttr;
};

var newSubObject = new subObject("sub");

console.log( "super: " + newSubObject.getSuperValue() );
console.log(newSubObject.superAttr);
console.log( "sub: " + newSubObject.getSubValue() );
console.log(newSubObject.subAttr);

// 子类更改原型属性
subObject.prototype.getSuperValue = function(){

    return "super changed";
}

var newSubObject2 = new subObject2("sub");
console.log("sub2's super: " + newSubObject2.getSuperValue());
