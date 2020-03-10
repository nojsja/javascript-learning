/*
  创建即继承 -- 构造函数继承：
  在子类的构造函数中执行父类函数, 利用call/apply改变了函数的执行上下文，不涉及原型，没有子类共享属性的问题，
  各个子类的属性都是单独的，不能共享，这样违背了代码复用的原则，增加了程序额外的运行开销
*/

function superObject(id) {
    this.attrArray = [1, 2, 3, 4, 5];
    this.id = id;
}

function subObject(id) {

    // 在子类的上下文完全复制superObject构造函数并执行
    superObject.call(this, id);

}

subObject.prototype.getId = function(){

    return this.id;
}

var newSubObject = new subObject("sub.id");
console.log(newSubObject.getId());
