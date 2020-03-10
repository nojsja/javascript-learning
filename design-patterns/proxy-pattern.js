/* -----------------------------------------------------------------------------
  代理模式 -- 使用替身对象预处理移交给主对象的请求
  保护代理和虚拟代理：
  保护代理：用户控制不同权限的对象对目标对象的访问，但在JavaScript中不容易实现保护代理，
  因为无法判断谁访问了某个对象。
  虚拟代理：如果在目标对象中有一些很消耗时间和性能的操作，那么可以把这些操作委托给代理来控制
  执行，当代理对象中满足某个一特定情况后才执行这些操作。
----------------------------------------------------------------------------- */

/* ************************* 实例1 小明送花(保护) ************************* */
// 注意代理和本体接口的一致性

// 对象花
var Flower = function () {};

// 追求mm的小明
var XiaoMing = {
  isRich: false,
  sendFlower: function (target) {
    var flower = new Flower();
    target.recieveFlower(flower);
  }
};

// mm的闺蜜
var GuiMi = {
  recieveFlower: function (flower) {
    // 如果小明有钱的花就送
    // 闺蜜会了解MM心情好不好
    if (XiaoMing.isRich) {
      MM.listenGoodMood(function () {
        MM.recieveFlower(flower);
      })
    }
  }
};

// mm
var MM = {
  recieveFlower: function (flower) {
    console.log('recieved flower!');
  },
  listenGoodMood: function (fn) {
    setTimeout(fn, 1000);
  }
};

/* ************************* 实例2 图片懒加载(虚拟) ************************* */

// 这里体现了单一职责原则：
// 就一个类而言应该只有一个引起它变化的原因，如果一个对象承担了多个职责，就意味着这个对象将变得
// 巨大，引起它变化的原因可能有多个。而面向对象设计鼓励将行文分布到细粒度的对象之中，
// 如果一个对象承担的职责过多，等于把这些职责耦合到了一起，这种耦合会导致脆弱的低内聚的设计，
// 需求的变化很可能会破坏整个设计。

// 本体对象
var myImage = (function () {
  var image = document.createElement('img');
  document.body.appendChild(image);

  return {
    setSrc: function (address) {
      image.src = address;
    }
  };

})();

// 代理对象
var proxyImage = (function () {
  var img = document.createElement('img');
  img.onload = function () {
    myImage.setSrc(this.src);
  };

  return {
    setSrc: function (address) {
      myImage.setSrc('/path/to/loading.png');
      img.src = address;
    }
  };
})();












//
