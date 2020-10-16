var childLeft = document.querySelector('.child-left');

/**
 * [给出起始坐标和终点坐标移动元素]
 * @author 杨伟(yang.wei@datatom.com)
 * @param target {DOM} [目标dom对象]
 * @param originPos {object} [原坐标x 和 y]
 * @param toPot {object} [终点坐标x 和 y]
 */
var animateTo = function (target, originPos, toPos) {

  // 移动距离
  var value = toPos - originPos, direction, topValue;
  direction = value >= 0 ? true : false;
  var size = 5;

  function go() {
      value = Math.abs(value) - size;
      if(value <= 0){
          clearInterval(showTimer);
          target.style.top = toPos + 'px';
      }else {

          topValue = Number(target.style.top.substr(0, target.style.top.length - 2));
          if (direction) {
            target.style.top = topValue + size + 'px';
          }else {
            target.style.top = topValue - size + 'px';
          }
      }
  }
  var showTimer = setInterval(go, 14);
}


// 检测元素
 var clickFn = function (e) {
  var event = e || window.event;
  var eventTarget = event.target || event.arcElement;
  var targetHeight = eventTarget.offsetTop;
  var targetText = eventTarget.getAttribute('tips');
  var target = document.querySelector('.' + eventTarget.getAttribute('target'));

  animateTo(target, target.offsetTop, targetHeight);
  target.innerText = targetText;
};

for (var i = 0; i < childLeft.children.length; i++) {
  childLeft.children[i].addEventListener('click', clickFn);
}
