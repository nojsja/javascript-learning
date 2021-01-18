/**
* @name: 节流函数
* @description: 高频事件触发，但在n秒内只会执行一次，所以节流会稀释函数的执行频率
*/

function throttle(fn, time=100) {
  let canRun = true;
  
  return function () {
    if (!canRun) return;
    canRun = false;
    setTimeout(() => {
      fn.apply(this, arguments);
      canRun = true;
    }, time);
  };
}
