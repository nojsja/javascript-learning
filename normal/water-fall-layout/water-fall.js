    /**
     * [WaterFall 图片瀑布流构造函数]
     * @param  {DomElement} father   [瀑布流的容器元素]
     * @param  {String} childClass   [瀑布流子元素类名选择器 如: .water-fall-item]
     * @param  {Number} columnWidth  [设定每一列的宽度，单位: px]
     * @param  {Number} paddingWidth [设定图片之间的间隔距离， 单位: px]
     */
    function WaterFall(father, childClass, columnWidth, paddingWidth) {
      this.$container = father;  // 容器
      this.childSelector = childClass;  // 子代img选择器
      this.children = [];  // 子代img
      this.columnWidth = columnWidth;  // 单列宽度
      this.paddingWidth = paddingWidth + 'px';  // 图片之间的间隔距离

      this.totalWidth = this.$container.clientWidth;  // 容器宽度
      this.columnNum = ~~(this.totalWidth / this.columnWidth);  // 列数

      // 调用多次
      this.step = function () {
        this.totalWidth = this.$container.clientWidth;
        this.columnNum = ~~(this.totalWidth / this.columnWidth);
        this.children = this.$container.querySelectorAll(this.childSelector);
        for (var i = 0; i < this.children.length; i++) {
          this.children[i].style.width = this.columnWidth + 'px';
          this.children[i].style.height = 'auto';
          this.children[i].style.paddingRight = this.paddingWidth;
          this.children[i].style.paddingBottom = this.paddingWidth;

          // 每行第一个设置左padding
          if (i % this.columnNum === 0) {
            this.children[i].style.paddingLeft = this.paddingWidth;
          }

          // 第一行 和 其它行的不同处理
          if (i < this.columnNum) {
            this.children[i].style.left = (i) * this.columnWidth + 'px';
            this.children[i].style.top = (i) * 0 + 'px';
          }else {
            this.children[i].style.left = this.children[i - this.columnNum].style.left;
            this.children[i].style.top = +this.children[i - this.columnNum].style.top.replace('px', '') +
                                          this.children[i - this.columnNum].clientHeight + 'px';
          }
        }
      };
    };




    /**
     * [waterFallInit 瀑布流初始化]
     * @param  {String} wData [图片url的数组]
     */
    var waterFallInit = function (wData) {
      var fragment = document.createDocumentFragment();
      var div, img, timer, $imgs, length, index = 0;
      // 载入图片
      for (var i = 0; i < wData.length; i++) {
        div = document.createElement('div');
        img = document.createElement('img');
        div.setAttribute('class', 'water-fall-item');
        img.setAttribute('src', wData[i]);
        div.appendChild(img);
        fragment.appendChild(div);
        if (i === wData.length - 1) {
          domMap.$waterFall.appendChild(fragment);
        }
      }

      // 一个瀑布流实例
      var waterfall = new WaterFall(domMap.$waterFall, '.water-fall-item', 200, 5);

      // 轮询所有图片的加载状态
      timer = setInterval(function () {
        $imgs = domMap.$waterFall.querySelectorAll('.water-fall-item > img');
        length = $imgs.length;
        for (var i = 0; i < $imgs.length; i++) {
          if ($imgs[i].complete) {
            if (++index === length) clearInterval(timer);
          }
        }
        waterfall.step();
      }, 250);

      // 窗口拖动
       window.onresize =  function () {
         Utils.FnDelay(function () {
           waterfall.step();
         }, 800);
       }
    };
