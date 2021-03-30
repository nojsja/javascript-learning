/* -------------------------------------------------------
  description:

  设计一个支持 push ，pop ，top 操作，并能在常数时间内检索到最小元素的栈。

  push(x) —— 将元素 x 推入栈中。
  pop() —— 删除栈顶的元素。
  top() —— 获取栈顶元素。
  getMin() —— 检索栈中的最小元素。
   

  示例:

  输入：
  ["MinStack","push","push","push","getMin","pop","top","getMin"]
  [[],[-2],[0],[-3],[],[],[],[]]

  输出：
  [null,null,null,null,-3,null,0,-2]

  解释：
  MinStack minStack = new MinStack();
  minStack.push(-2);
  minStack.push(0);
  minStack.push(-3);
  minStack.getMin();   --> 返回 -3.
  minStack.pop();
  minStack.top();      --> 返回 0.
  minStack.getMin();   --> 返回 -2.
   

  提示：

  pop、top 和 getMin 操作总是在 非空栈 上调用。


  来源：力扣（LeetCode）
  链接：https://leetcode-cn.com/problems/min-stack
  著作权归领扣网络所有。商业转载请联系官方授权，非商业转载请注明出处。
------------------------------------------------------- */

/**
 * initialize your data structure here.
 */
var MinStack = function() {
  this.stack = [];
  this.min = null;
  this.minStack = [];
};

/** 
 * @param {number} x
 * @return {void}
 */
MinStack.prototype.push = function(x) {
  this.stack.push(x);
  var i = this.stack.length - 1;
  this.minStack.push(i);
  var tmp;
  
  while (i > 0) {
    if (this.stack[this.minStack[i-1]] > this.stack[this.minStack[i]]) {
      tmp = this.minStack[i];
      this.minStack[i] = this.minStack[i - 1];
      this.minStack[i - 1] = tmp;
    } else {
      break;
    }
    i--;
  }
  return null;
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function() {
  if (this.stack.pop() === undefined) return null;

  var index = this.stack.length;
  index = this.minStack.indexOf(index);
  this.minStack.splice(index, 1);

  return null;
};

/**
 * @return {number}
 */
MinStack.prototype.top = function() {
  return this.stack.length ? this.stack[this.stack.length - 1] : null;
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function() {
  return this.stack[this.minStack[0]];
};

/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(x)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */


/* -------------- 方法二 -------------- */

/**
 * initialize your data structure here.
 */
 var MinStack = function() {
  this.stack = [];
  this.minStack = [];
};

/** 
 * @param {number} val
 * @return {void}
 */
MinStack.prototype.push = function(val) {
  this.stack.push(val);
  if(this.minStack.length) {
    this.minStack.push(Math.min(val, this.minStack[this.minStack.length - 1]));
  } else {
    this.minStack.push(val);
  }
  return  null;
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function() {
  this.minStack.pop();
  return this.stack.pop();
};

/**
 * @return {number}
 */
MinStack.prototype.top = function() {
  return this.stack[this.stack.length - 1];
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function() {
  return this.minStack[this.minStack.length - 1];
};