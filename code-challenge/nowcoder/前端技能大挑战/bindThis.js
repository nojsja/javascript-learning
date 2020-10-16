/* -----------------------------------------------------------------------------
  封装函数 f，使 f 的 this 指向指定的对象
----------------------------------------------------------------------------- */

function bindThis(f, oTarget) {
  return f.bind(oTarget);
}

function test() {
  this.t1 = 1;
  this.t2 = 2;
}

var target = {
  t1: 2,
  t2: 3
};

// test =  bindThis(test, target)
test = test.bind(target);
var testChild = new test();
console.log(testChild);
