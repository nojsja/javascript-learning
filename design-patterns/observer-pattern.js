/* -----------------------------------------------------------------------------
  观察者模式：
  1. 全局的观察者模式对象，所有事件的订阅、触发、移除都由这个全局对象处理，适用于需要创建大量
  观察者对象。
  2. 构建观察者模式类，使用时可以实例化一个观察者对象，适用于需要创建少量的观察者对象。
----------------------------------------------------------------------------- */

/* ************************* 函数式观察者实现 ************************* */
// 观察者初始化
var ObserverObject = {
  watcherList: {
    '_default': {}
  }
};

/**
 * [listen 注册新的观察者]
 * @param paramObj {Object.isRequired} [描述所有参数的对象]
 *   - type {String.isRequired} [监听的事件名]
 *   - callback {Func.isRequired} [事件触发的回调函数]
 *   - namespace {String} [事件触发的命名空间]
 */
ObserverObject.listen = function (paramObj) {
  var type = paramObj['type'],
    namespace = paramObj['namespace'] || '_default',
    callback  = paramObj['callback'];


  if (!ObserverObject.watcherList[namespace]) {
    ObserverObject.watcherList[namespace] = {};
    ObserverObject.watcherList[namespace][type] = [];
  }
  if (!type)
    throw new Error('function listen in ObserverObject needs a param -> type !');

  ObserverObject.watcherList[namespace][type].push(fn);
 };

 /**
  * [trigger 触发指定类型的所有监听函数]
  * @param paramObj {Object.isRequired} [描述传入参数的对象]
  *   - type {String.isRequired} [监听的事件名]
  *   - data {Object | String} [触发携带的参数]
  *   - namespace {String} [事件触发的命名空间]
  */
object.trigger = function (paramObj) {
  var type = paramObj['type'],
    namespace = paramObj['namespace'] || '_default',
    data = paramObj['data'];
  var list = ObserverObject.watcherList[namespace][type];

  if(list && list.length){
    for(var i = 0; i < list.length; i++){
      list[i].call(object, data);
    }
  }else {
    return false;
  }
 };

 // 解绑观察者事件监听
object.remove = function (paramObj) {
  var type = paramObj['type'],
    namespace = paramObj['namespace'] || '_default',
    callback = paramObj['callback'];
  var list = Object.watcherList[namespace][type];

  if (!type)
    throw new Error('function listen in ObserverObject needs a param -> type !');

  if (!list) return false;

  for(var i = list.length - 1; i >= 0; i-- ){
      if(fn === list[i]){
          list.splice(i, 1);
      }
  }
 };


 /* ************************* 类式观察者实现 ************************* */
 // 事件对象
function ObserverTarget() {
  this.handlers = {};
}

ObserverTarget.prototype = {
  constructor: EventTarget,
  addHandler: function (type, handler) {
    if (this.handlers[type]) {
      this.handlers[type].push(handler);

    }else {
      this.handlers[type] = [handler];
    }
  },
  trigger: function (type) {
    if (this.handlers[type]) {
      if (this.handlers[type] instanceof Array) {
        for (var i = 0, len = this.handlers[type].length; i < len; i++) {
          this.handlers[type][i]();
        }
      }
    }
  },
  remove: function (type, handler) {
    if (this.handlers[type] && typeof(handler) !== "undefined") {
      if (this.handlers[type] instanceof Array) {
        for (var i = 0, len = this.handlers[type].length; i < len; i++) {
          if (this.handlers[type][i]  == handler) {
            break;
          }
        }
        // 移除元素
        this.handlers[type].splice(i, 1);
        if (this.handlers[type].indexOf(handler) != -1) {
          this.remove(type, handler);
        }
      }
    }else {
      this.handlers[type] = [];
    }
  }
};
