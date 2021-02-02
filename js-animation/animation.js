// 动画帧请求函数兼容写法
window.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            return window.setTimeout(callback, 1000 / 60);
          };
})();

/**
 * [tween 缓动算法]
 * @param {[Number]}  t [动画已经消耗的时间]
 * @param {[String]}  b [目标开始的位置]
 * @param {[String]}  c [目标开始位置和结束位置的距离]
 * @param {[Number]}  d [动画总持续时间]
 */
var tween = {
  linear: function( time, start, distance, duration ) { return distance*time/duration + start; },
  easeIn: function( time, start, distance, duration ) { return distance * ( time /= duration ) * time + start; },
  strongEaseIn: function(time, start, distance, duration) { return distance * ( time /= duration ) * time * time * time * time + start; },
  strongEaseOut: function(time, start, distance, duration) { return distance * ( ( time = time / duration - 1) * time * time * time * time + 1 ) + start; },
  sinEaseIn: function( time, start, distance, duration ) { return distance * ( time /= duration) * time * time + start; },
  sinEaseOut: function(time,start,distance,duration){ return distance * ( ( time = time / duration - 1) * time * time + 1 ) + start; },
};


/* ------------------- 动画控制类 ------------------- */
var Animation = function () {
  this.store = { // status store
  };
};

/* ------------------- 初始化处理元素 ------------------- */
Animation.prototype.setTarget = function (selector) {
  var element = document.querySelector(selector);

  if (element) {
    // element.style.position = 'relative';
    this.store[selector] = {
      selector: selector,
      element: document.querySelector(selector),
      status: 'pending',
      queue: [
        /*
        {
          x: 'xxx', // 相对位置
          y: 'xxx', // 相对位置
          duration: 'xxx', // 毫秒
          func: func,
        }
        */
      ],
      timeStart: '',
      positionStart: {
        x: '',
        y: '',
      },
      positionEnd: {
        x: '',
        y: '',
      },
    };
  }
};

/**
 * [start 开始动画]
 * @param  {[String]} selector [选择器]
 * @param  {[type]} func     [缓动动画]
 */
Animation.prototype.start = function (selector, func) {
  var that = this;
  var target = this.store[selector];
  target.status = 'running';

  // 帧调用函数
  that.update({x: 0, y: 0}, selector);
};

/**
 * [update 更新位置]
 * @param  {[type]} selector [description]
 */
Animation.prototype.update =  function (position, selector) {
  var target = this.store[selector],
    that = this,
    timeUsed,
    positionX, positionY;
  //
  if (!target || !target.queue.length) {
    target.status = 'pending';
    return;
  };

  // reset position
  target.element.style.left = position.x + 'px';
  target.element.style.top = position.y + 'px';

  // position
  target.positionStart = {
    x: position.x,
    y: position.y,
  };
  target.positionEnd = {
    x: position.x + target.queue[0].x,
    y: position.y + target.queue[0].y,
  };
  // time
  target.timeStart = null;

  // 递归调用
  var callback = function (time) {
    if (target.timeStart === null) target.timeStart = time;
    timeUsed = time - target.timeStart;
    // 当前动画完成
    if (timeUsed >= target.queue[0].duration) {
      target.queue.shift();
      that.step(target.element, target.positionEnd.x, target.positionEnd.y);
      target.status = 'running';
      // var position = target.element.getBoundingClientRect();
      var position = {
        x: parseInt(target.element.style.left),
        y: parseInt(target.element.style.top),
      };
      // 下一个动画
      that.update(position, selector);
      return;
    }
    positionX = target.queue[0].func(
      timeUsed,
      target.positionStart.x,
      target.positionEnd.x - target.positionStart.x,
      target.queue[0].duration,
    );
    positionY = target.queue[0].func(
      timeUsed,
      target.positionStart.y,
      target.positionEnd.y - target.positionStart.y,
      target.queue[0].duration,
    );
    that.step(target.element, positionX, positionY);

    requestAnimationFrame(callback);
  };

  requestAnimationFrame(callback);
};

/**
 * [step dom操作]
 * @param  {[DOM]} element [dom 元素]
 * @param  {[Number]} x        [x坐标]
 * @param  {[Number]} y        [y坐标]
 */
Animation.prototype.step = function (element, x, y) {
  element.style.left = x + 'px';
  element.style.top = y + 'px';
};

/* ------------------- 暂停动画 ------------------- */
Animation.prototype.pause = function (selector) {

};

/* ------------------- 结束动画 ------------------- */
Animation.prototype.stop = function (selector) {

};

/**
 * [push 加入动画队列]
 * @param  {[String]} selector [dom选择器]
 * @param  {[Object]} conf     [位置数据]
 */
Animation.prototype.push = function (selector, conf) {
  if (this.store[selector]) {
    this.store[selector].queue.push({
      x: conf.x,
      y: conf.y,
      duration: conf.duration || 1000,
      func: tween[conf.func] || tween['linear'],
    });
  }
};

/* ------------------- 动画出队列 ------------------- */
Animation.prototype.pop = function (selector) {
  if (this.store[selector]) {
    this.store[selector].queue.pop();
  }
};

/* ------------------- 清空动画队列 ------------------- */
Animation.prototype.clear = function (selector) {
  if (this.store[selector]) {
    this.store[selector].queue.length = 1;
  }
};
