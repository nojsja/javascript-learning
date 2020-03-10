/*
  寄生式继承 -- 基于原型式继承
  利用了设计模式 -- 代理模式
*/

// 通过过度函数创建实例对象的方法
function inheritObject (obj){

    // 声明干净的过度函数
    function F(){
    }

    // 直接将基类的属性给过度类，没有原型链的共享
    F.prototype = obj;

    // 继承属性的过度类实例对象
    return new F();
}

// 基类
var bookBase = {
    name: 'book',
    contentArray: ['js', 'php'],
    getContentArray: function () {
      return this.contentArray;
    }
};

function createBook(obj, name){

    var o = inheritObject(obj);
    name && (o.name = name);
    // 进行属性扩展
    o.getName = function() {
        return (o.name);
    };

    return o;
}

var book1 = createBook(bookBase);
var book2 = createBook(bookBase);

console.log("book1' name: ", book1.getName());
book1.name = 'book1';
console.log("book1' name: ", book1.getName());
console.log("book2' name: ", book2.getName());
