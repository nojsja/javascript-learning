/* ------------------------------------------------------------
 通过setTimeout模拟RequestAnimationFrame, render函数根据时间戳动态
 更改帧动画
 时间间隔15ms -> 60fps
 currentTime - startTime -> 一帧动画的执行时间
------------------------------------------------------------- */

let startTime = new Date().getTime();

const raf = (fn) => {
  let currentTime = new Date().getTime();
  let delay = Math.max(0, 16 - (currentTime - startTime));
  setTimeout(() => {
    fn(currentTime, startTime);
  }, delay);
  startTime = currentTime;
};

let left = 0;
const dom = document.querySelector('#id');
const render = (currentTime, startTime) => {
  left += (currentTime - startTime) / 16;
  dom.style.left = left + 'px';
  if(left < 400){
    raf(render);
  }
};