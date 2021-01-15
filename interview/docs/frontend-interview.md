
### 面试阶段分析
----------

1. 一面主要是针对基础知识，面试官会根据你的简历对各个知识点进行考察，需要有扎实的基础，提升对基础知识的熟悉度。
2. 二面面试官会考察你知识掌握的深入程度，会根据你的个人项目，深挖其中的技术点。比如如果项目中用了React的话可能问你React diff算法、React性能优化等等，所以需要对个人项目所涉及到的技术点有深入研究和理解。
3. 三面四面也会根据你的项目对你提问，需要熟知自己项目的闪光点以及一些尚待优化之处。除此之外面试官可能会出一些实际生产环境下的场景题，考察你的思维逻辑、技术积累和应变能力。

### 个人介绍
----------

#### 重点

- 我最突出的技能是什么
- 我在哪方面的知识掌握是最全面的
- 我性格上最大的优势是什么
- 我最擅长的事情是什么
- 我有哪些成就和贡献

#### 范例



### 描述在上一家公司的工作经历
----------


### 要点：HTML/CSS
----------

- BFC，块级格式化上下文。
```sh
1) BFC 就是块级格式上下文，是页面盒模型布局中的一种 CSS 渲染模式，
相当于一个独立的容器，里面的元素和外部的元素相互不影响。创建 BFC 的方式有：
  html 根元素
　float 浮动
  overflow 不为 visiable
  position值不为static，relative
  display 为Table布局、Flex布局、inline-block、Grid布局

2) BFC 主要的作用是：
  清除浮动（不会和浮动元素重叠）
  防止同一 BFC 容器中的相邻元素间的外边距重叠问题
  多列布局

3) BFC 表现
  内部的Box会在垂直方向上一个接一个放置
  Box垂直方向的距离由margin决定，属于同一个BFC的两个相邻Box的margin会发生重叠
  每个元素的 margin box 的左边，与包含块 border box 的左边相接触
  BFC的区域不会与float box重叠
  BFC是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素
  计算BFC的高度时，浮动元素也会参与计算

```
- 两列布局实现。
```sh
1) 使用float浮动元素同时设置元素宽度为100/列数 %
2) 使用inline-block实现方式同1
2) 使用css属性column-count实现
```
- 1px问题。
```sh
1) 涉及到css像素比 device pixel/css pixel = devicePixelRatio(DPR)
2) 解决方法一
  伪元素设置height模拟边框：
  .setBorderAll{
     position: relative;
       &:after{
           content:" ";
           position:absolute;
           top: 0;
           left: 0;
           width: 200%;
           height: 200%;
           transform: scale(0.5);
           transform-origin: left top;
           box-sizing: border-box;
           border: 1px solid #E5E5E5;
           border-radius: 4px;
      }
    }
  }
3) 解决方法二
  设置盒子阴影：
  box-shadow: 0  -1px 1px -1px #e5e5e5,   //上边线
            1px  0  1px -1px #e5e5e5,   //右边线
            0  1px  1px -1px #e5e5e5,   //下边线
            -1px 0  1px -1px #e5e5e5;   //左边线
```
- 浮动解决的方案。
```sh
1) 清除浮动的属性
  需要不跟随浮动元素尾部布局的元素设置clear:both
2) 撑起浮动容器元素的方法一
  在浮动元素的最后插入一个声明了clear:both的块级元素
3) 撑起浮动容器元素的方法二
  在浮动容器元素后使用伪元素
  .container:after {
    content: '.';
    height: 0;
    display: block;
    clear: both;
  }
4) 撑起浮动容器元素的方法三
  利用BFC特性，设置浮动元素的overflow不为visible
```

- 位图和矢量图的区别。
```sh
1) 位图也叫像素图，每个点可以用二进制描述颜色和亮度信息，色彩表现丰富，占用空间大，缩放失真
2) 矢量图使用计算机指令绘制而成，由点线面构成，色彩不丰富，占用空间小，缩放不失真
```

### 要点：Javascript
----------

- js类型的判断
```js
/*
基础类型：string/boolean/number/null/undefined/symbol
引用类型：function/object(date|regexp|obj)/array
*/
function getTypeOf(data) {
  if (data !== data) return 'nan';
  switch(Object.prototype.toString.call(data)) {
    case '[object Null]':
      return 'null';
    case '[object Array]':
      return 'array';
    case '[object Object]':
      return 'object';
    case '[object RegExp]':
      return 'regexp';
    case '[object Date]':
      return 'date';
    default:
      return (typeof data);
  }
}
```
- Js实现继承
- 编实现EventBus
- 深拷贝和浅拷贝
```js

/* -------------- 深拷贝 -------------- */
function deepClone(data) {

  const map = new WeakMap();
  
  const isObjType = (obj, type) => {
    if (typeof obj !== 'object') return false;
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
  };

  const _clone = (target) => {
    if (target === null) return null;
    if (target !== target) return NaN;
    if (typeof target !== 'object') return target;
    
    let base;

    // 对正则对象做特殊处理
    if (isObjType(target, 'RegExp')) return new RegExp(target.source, target.flags);
    // 对Date对象做特殊处理
    if (isObjType(target, 'Date')) return new Date(target.getTime());

    base = isObjType(target, 'Array') ? [] : {};

    // 处理循环引用
    if (map.get(target)) return map.get(target);
    map.set(target, base);
    
    for (let i in target) {
      base[i] = _clone(target[i]);
    }
    
    return base;
  };

  return _clone(data);
};

/* -------------- 浅拷贝 -------------- */
function shallowClone(data) {
  let base;

  if (!data || !(typeof data === 'object')) {
    return data;
  } else {
    base = Object.prototype.toString.call(data) === '[object Array]' ? [] : {};
  }

  for (let attr in data) {
    if (data.hasOwnProperty(attr)) {
      base[attr] = data[attr];
    }
  }

  return base;
}

```
- ES6新增特性
- async await如何利用generator
- 移动端点击穿透问题
- 图片懒加载具体实现方案和思路
- 函数防抖和节流实现
```js
/* 去抖 */
function debounce(fn, time) {
  let timer;

  return function() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, time);
  }
}

/* 节流 */
function throttle(fn, time) {
  let canRun = true;

  return function() {
    if (canRun) {
      canRun = false;
      setTimeout(() => {
        fn.apply(this, arguments);
        canRun = true;
      }, time)
    }
  }
}
```
- Js/Node的事件循环(宏任务、微任务)
- 页面加载会触发哪些事件。
- document.ready和window.onload的区别。
- 闭包Closure
- 函数式编程思想的体现
- vue双向绑定实现原理
- Vue2.0与Vue3.0双向绑定，proxy实现
- React-Fiber原理
- React生命周期，React16.3版本后变化，为什么要这样做。（结合React Fiber)，有哪些不安全的生命周期
- react虚拟dom以及diff算法
- babel源码
- React SetState原理
- 错误监控方法
- 实现一个EventEmitter类，支持事件的on,off,emit,once,setMaxListeners。
```js
function EventEmitter() {
  this.maxListeners = 100;
  this.listeners = {};
  this.onceMap = {};
}

EventEmitter.prototype.setMaxListeners = function(num) {
  if (typeof num !== 'number' || !Number.isInteger(num) || num <= 0)
    throw new Error('setMaxListeners - param num must be a positive integer!');
  this.maxListeners = num;
}

EventEmitter.prototype.on = function(type, func) {
  if (!type || !func instanceof Function) return;
  if (this.listeners[type]) {
    this.listeners[type].push(func);
  } else {
    this.listeners[type] = [func];
  }
  this.onceMap[type] = false;
}

EventEmitter.prototype.once = function(type, func) {
  if (!type || !func instanceof Function) return;
  this.on(type, func);
  this.onceMap[type] = true;
}

EventEmitter.prototype.off = function(type, func) {
  if (!type || !func) return;
  if (this.listeners[type]) {
    this.listeners[type] = this.listeners[type].filter(function(fn) { return fn !== func; });
    delete this.onceMap[type];
  }
}

EventEmitter.prototype.emit = function(type) {
  (this.listeners[type] || []).forEach(function(fn) {
    fn();
  });
  if (this.onceMap[type]) delete this.listeners[type];
  delete this.onceMap[type];
}
```

- 如何自己实现一个单点登录系统。
- 手写diff。
- 手写Promise  
[链接-> 使用ES5实现ES6 Promise API](https://github.com/nojsja/promise-nojsja)

### 要点：Node.js
----------

- node是IO密集型体现在哪里。
从node异步的角度来回答这个问题。
参考点这里➡️ https://www.jianshu.com/p/c28219029c65
0- node事件循环。


### 要点：设计模式
----------

1. [策略模式](https://github.com/nojsja/javascript-learning/tree/master/design-patterns#1-the-strategy-pattern%E7%AD%96%E7%95%A5%E6%A8%A1%E5%BC%8F)

2. [观察者模式](https://github.com/nojsja/javascript-learning/tree/master/design-patterns#2-the-observer-pattern%E8%A7%82%E5%AF%9F%E8%80%85%E6%A8%A1%E5%BC%8F)

3. [享元模式](https://github.com/nojsja/javascript-learning/tree/master/design-patterns#3-the-flyweight-pattern%E4%BA%AB%E5%85%83%E6%A8%A1%E5%BC%8F)

4. [装饰者模式](https://github.com/nojsja/javascript-learning/tree/master/design-patterns#4-the-decorator-pattern%E8%A3%85%E9%A5%B0%E8%80%85%E6%A8%A1%E5%BC%8F)

5. [代理模式](https://github.com/nojsja/javascript-learning/tree/master/design-patterns#5-the-proxy-pattern%E4%BB%A3%E7%90%86%E6%A8%A1%E5%BC%8F)

6. [状态模式](https://github.com/nojsja/javascript-learning/tree/master/design-patterns#6-the-state-pattern%E7%8A%B6%E6%80%81%E6%A8%A1%E5%BC%8F)

7. [责任链模式](https://github.com/nojsja/javascript-learning/tree/master/design-patterns#7-the-responsibility-chain-pattern%E8%B4%A3%E4%BB%BB%E9%93%BE%E6%A8%A1%E5%BC%8F)

8. [模板方法模式](https://github.com/nojsja/javascript-learning/tree/master/design-patterns#7-the-responsibility-chain-pattern%E8%B4%A3%E4%BB%BB%E9%93%BE%E6%A8%A1%E5%BC%8F)

### 要点：前端工具
---------

- 打包gulp.webpack,rollup一些区别。
- ts自己的看法，和应用。
- webpack loader和plugin区别。
- webpack中循环引用问题，a里面引用了b，b里面引用了a
- webpack性能优化方面

### 要点：性能优化
--------

- 性能优化的各方面

- 弱网环境下页面首屏如何快速加载
方案：1.缓存的使用 2.SSR使用 3.骨架屏使用

### 要点：操作系统和网络
----------

- 常见攻击，CSRF是什么，如何防范，token产生策略。

- 跨域的基本概念和解决方法，在项目中的实际应用。

- 强缓存和协商缓存，缓存的应用，如何用在页面性能优化上。

- 爬虫方面问题，反爬如何实现，针对反爬的实现(IP代理等）。

- 进程和线程区别。

- cpu调度算法。

- 2台计算机底层之间如何通信 socket IO通信实现。

- cookie中常见的字段。
- 同源策略。
- http中一些常见的响应头和请求头，有什么应用。
- 简单请求和非简单请求区别。
- http2 http3优化点在哪 https建立连接过程
- 计算机网络中，http地址，在7层协议中，如何一步步向下解析，从应用层到最底层的物理层，每一层处理的事情。
- http2.0 http3.0分别改进了什么

### 要点：数据结构和算法
----------

- 算法题：版本号比较
https://leetcode-cn.com/problems/compare-version-numbers/
- IP地址复原
https://leetcode-cn.com/problems/restore-ip-addresses/

- 全排列算法的实现。
- 斐波那契算法。
- 25匹马、5个赛道,怎么用最少的次数决出前三名

### 要点：个人规划
----------

- 未来规划，如何学习前端的，自己感兴趣的前端方向是什么。
