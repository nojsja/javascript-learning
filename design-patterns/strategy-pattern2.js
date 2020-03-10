/* -----------------------------------------------------------------------------
  多态在策略模式中的体现：
  编写Animation缓动动画类和缓动算法，让组件在页面中以各种各样的效果在页面运动。
  运动开始之前需要记录组件的目标位置、运动持续时间、动画开始的准确时间，然后在start方法里每19
  ms调用一次step函数，step函数表示动画的每一帧，需要传入[动画已经消耗的时间、原始位置、目标位置
  到初始位置的距离、动画持续的总时间]来计算小球所处的位置，最后更新css属性即可实现运动过程。
----------------------------------------------------------------------------- */

/* ************************* 缓动算法 ************************* */
// t -> 已经消耗的时间
// b -> 初始位置
// c -> 初始位置到终点位置的间隔距离
// d -> 总的动画时间限制间隔
var tween = {
  linear: function (t, b, c, d) {
    return c*t / d + b;
  },
  easeIn: function (t, b, c, d) {
    return c * ( t /= d ) * t + b;
  },
  strongEaseIn: function () {
    return c * ( t /= d ) * t * t *t * t + b;
  },
  strongEaseOut: function () {
    return c * ( (t = t / d - 1) * t * t * t * t + 1 ) + b;
  },
  sineaseIn: function () {
    return c * ( t /= d ) * t * t + b;
  },
  sineaseOut: function () {
    return c * ( (t = t / d - 1) * t * t + 1 ) + b;
  }
};

/* ************************* DOM结构 ************************* */
'<body>'
    '<div style="position:absolute; background: blue" id="div">'
      '我是div'
    '</div>'
'</body>'


/* ************************* 动画类 ************************* */

/* ------------------- 构造函数 ------------------- */
var Annimate = function (dom) {
  this.dom = dom;  // dom对象
  this.startTime = 0;  // 动画开始时间
  this.startPos = 0; // dom的初始位置
  this.endPos = 0;  // dom的目标位置
  this.propertyName = null;  // dom节点需要被改变的dom属性名
  this.easing = null;  // dom运动的缓动算法
  this.duration = null;  // 动画持续的时间
};

/* ------------------- 动画启动 ------------------- */
Annimate.prototype.start = function ( propertyName, endPos, duration, easing ) {
  this.startTime = +new Date;  // 动画启动时间
  // 相对于窗口的位置
  this.startPos = this.dom.getBoundingClientReact()[propertyName];  // 节点的初始位置
  this.propertyName = propertyName;  // dom需要被改变的属性名
  this.endPos = endPos;
  this.easing = tween[easing];  // 缓动算法

  var self = this;
  var timer = setInterval(function () {
    if (self.step() === false) {
      clearInterval(timer);
    }
  }, 19);
}

/* ------------------- 每一帧的动作 ------------------- */
// 对比自己编写的帧动画每一帧都需要计算当前位置，比较消耗性能
Animate.prototype.step = function () {
  var t = +new Date;
  if (t >= this.startTime + this.duration) {
    this.update(this.endPos);
    return false;
  }
  // 已经消耗的时间、初始位置、结束位置、总时间
  var pos =
    this.easing( t - this.startTime, this.startPos, this.endPos - this.startPos, this.duration);
  this.update(pos);
}

/* ------------------- 更新组件位置的方法 ------------------- */
Animate.prototype.update = function (pos) {
  this.dom.style[ this.propertyName ] = pos + 'px';
}

/* ************************* 测试 ************************* */
var div = document.querySelector('#div');
var animate = new Animate(div);
animate.start('left', 500, 1000, 'easeIn');
