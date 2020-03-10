/* -----------------------------------------------------------------------------
  一种基于继承的设计模式，模板方法模式由两部分组成，第一部分时抽象父类，第二部分时具体的实现字类，
  通常在抽象父类中封装了子类的算法框架，包括实现一些公共方法以及凤爪国内子类中所有方法的执行顺序，
  子类通过继承这个抽象类，也继承了整个算法结构，并且可以选择重写父类的方法。在模板方法模式中，子类
  实现中相同部分被上移到父类中，而将不同的部分等待子类来实现，体现了泛化的思想。
----------------------------------------------------------------------------- */

// ------- 父类冲泡饮料 -------- //
var Beverage = function () {
  this.shouldAddCondiments = true;
};

Beverage.prototype.boilWater = function () {
  console.log('boil the water');
};

Beverage.prototype.brew = function () {
  throw new Error('should overwrite brew func!');
};

Beverage.prototype.pourInCup = function () {
  throw new Error('should overwrite pourInCup func!');
};

Beverage.prototype.addCondiments = function () {
  throw new Error('should overwrite addCondiments func!');
};

Beverage.prototype.hook = function (shouldAddCondiments) {
  this.shouldAddCondiments = shouldAddCondiments;
};

Beverage.prototype.init = function () {
  this.boilWater();
  this.brew();
  this.pourInCup();
  if (this.shouldAddCondiments) {
    this.addCondiments();
  }
};

// ------- 子类泡咖啡和泡茶 -------- //
var Tea = function () {};

Tea.prototype = new Beverage();

Tea.brew = function () {
  console.log('brew for tea');
};

Tea.pourInCup = function () {
  console.log('pourInCup for tea');
};

Tea.addCondiments = function () {
  console.log('addCondiments for tea');
};

var tea = new Tea();
tea.init();


var Coffe = function () {};

Coffe.prototype = new Beverage();

Coffe.brew = function () {
  console.log('brew for coffe');
};

Coffe.pourInCup = function () {
  console.log('pourInCup for coffe');
};

Coffe.addCondiments = function () {
  console.log('addCondiments for coffe');
};

var coffe = new Coffe();
coffe.hook(false);
coffe.init();
