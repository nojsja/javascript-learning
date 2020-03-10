/*
  洁净的继承者 -- 原型式继承
  生成的实例对象共享原型对象上方法何属性
  某一个实例上的更改都会影响其它所有使用这种继承方法的实例对象
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

var bookBase = {
    name: 'book',
    contentArray: ['js', 'php']
};

var newBook1 = inheritObject(bookBase);
newBook1.name = 'newBook1';
newBook1.contentArray.push('newBook1');
console.log(newBook1.name, newBook1.contentArray);

var newBook2 = inheritObject(bookBase);
newBook2.name = 'newBook2';
newBook2.contentArray.push('newBook2');
console.log(newBook2.name, newBook2.contentArray);

console.log(bookBase.name, bookBase.contentArray);
