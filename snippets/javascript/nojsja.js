/*!
 * @author nojsja
 * @version 1.0
 *
 * */

(function () {

    /** 存储自定义方法 **/
    var MODULE_MAP = {};

    /** 被引用的作用域内部变量 **/
    var nojsja = {};

    /** 暴露的全局变量 **/
    window.nojsja = window.njj = nojsja;

    /* 定义模块 */
    nojsja["define"] = function (name, developments, implements) {

        if(typeof implements != 'function'){
            return false;
        }
        for(var i = 0; i < developments.length; i++){
            // 将module名字转化为module引用
            developments[i] = MODULE_MAP[developments];
        }
        // 添加模块
        MODULE_MAP[name] = implements.apply(implements, developments);
        return true;
    };

    /* 获取自定义模块模块 */
    nojsja["get"] = function (name) {
        return MODULE_MAP[name];
    };

    /* 删除自定义模块 */
    nojsja["delete"] = function (name) {
        if(MODULE_MAP[name]){
            delete MODULE_MAP[name];
            return true;
        }
        return false;
    };

    /* Ajax调用池 */
    nojsja["AjaxPool"] = (function() {

        //缓存XMLHttpRequest对象的数组
        var XMLHttpRequestPool = [];

        //方法返回一个XMLHttpRequest对象
        var getInstance = function() {
            for(var i = 0; i < XMLHttpRequestPool.length; i++) {
                //如果当前的请求对象空闲

                if(XMLHttpRequestPool[i].readyState == 0) {

                    return XMLHttpRequestPool[i];
                }
            }

            //如果没有空闲的
            XMLHttpRequestPool[XMLHttpRequestPool.length] = createXMLHttpRequest();
            return XMLHttpRequestPool[XMLHttpRequestPool.length - 1];
        };

        //创建XMLHttpRequest对象
        var createXMLHttpRequest = function () {

            if(window.XMLHttpRequest){
                var objXMLHttp = new XMLHttpRequest();
            }else{
                //将IE中内置的所有XMLHTTP ActiveX设置成数组
                var MSXML = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0',
                    'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];

                for(var n = 0; n < MSXML.length; n++) {
                    try{
                        var objXMLHttp = new ActiveXObject(MSXML[n]);
                        break;
                    }catch (e){
                        alert(e);
                    }
                }
            }

            //Mozilla某些版本没有Readystate属性
            if(objXMLHttp.readyState == null) {
                //手动置为未初始化状态
                objXMLHttp = 0;
                //对于没有readystate属性的浏览器，将load动作与下面的函数关联起来
                objXMLHttp.addEventListener("load", function(){
                    //等服务器的数据加载完成后，将readyState设为4
                    objXMLHttp.readyState = 4;
                    if(typeof objXMLHttp.onreadystatechange == "function"){
                        objXMLHttp.onreadystatechange();
                    }
                },false);
            }
            return objXMLHttp;
        };

        // 惰性载入获取XHR
        var createXHR = function() {
          if (typeof XMLHttpRequest != "undefined") {
            createXHR = function () {
              return new XMLHttpRequest();
            };
          } else if (typeof ActiveXObject !== "undefined") {
            createXHR = function () {
              if (typeof arguments.callee.activeXString != "string") {
                var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                  "MSXML2.XMLHttp"], i, len;
                for (i = 0, len = versions.length; i < len; i++) {
                  try {
                    new ActiveXObject(versions[i]);
                    arguments.callee.activeXString = versions[i];
                    break;
                  } catch (e) {

                  } finally {

                  }
                }
              }

              return new ActiveXObject(arguments.callee.activeXString);
            };

          } else {
            createXHR = function () {
              throw new Error("No XML object avaliable");
            };
          }
        };

        //发送请求
        var sendRequest = function(method, url, data, callback){

            var objXMLHttp = getInstance();

            try{
                //增加一个额外的请求参数，防止IE缓存服务器响应
                if(url.indexOf("?") > 0){
                    url += "&randnum=" + Math.random();
                }else{
                    url += "?randnum=" + Math.random();
                }
                objXMLHttp.open(method, url, true);
                if(method == ("POST")){
                    objXMLHttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    objXMLHttp.send(data);
                    /*//设置超时2.5分钟
                     setTimeout(function(){
                     if(objXMLHttp.readyState != 4 && objXMLHttp.readyState != 0){
                     alert("ajax响应超时");
                     objXMLHttp.abort();
                     }
                     }, "121000");*/
                }
                if(method == ("GET")){
                    objXMLHttp.send(null);
                }

                //设置状态改变的回调函数
                objXMLHttp.onreadystatechange = function () {
                    if(objXMLHttp.readyState == 4 &&
                        (objXMLHttp.status == 200 || objXMLHttp.status == 304)){

                        //服务器响应完成
                        callback.call(null, objXMLHttp);
                        //手动置为不可使用状态，加锁
                    }
                };
            }catch (e){
                alert(e);
            }
        };

        // 返回调用接口
        return {
            createXMLHttpRequest: createXMLHttpRequest,
            createXHR: createXHR,
            sendRequest: sendRequest
        }
    })();

    /* 模仿Promise实现的责任链类 */
    /* -----------------------------------------------------------------------------
      使用说明:
      let test1 = function (next) {
        console.log('test1');
        next && next('test1');
      };

      let test2 = function (next) {
        console.log('test2');
        setTimeout(function (){
          next && next('test2');
        }, 1000);
      };

      let test3 = function (next) {
        console.log('test3');
        next && next('test3');
      };

      let test = new Chain(test1);
      test.setSuccessor(new Chain(test2)).setSuccessor(new Chain(test3));
      test.passRequest();

      Chain.all([new Chain(test1), new Chain(test2), new Chain(test3)], function (t1, t2, t3) {
        console.log(arguments);
      });
    ----------------------------------------------------------------------------- */
    nojsja["Chain"] = (function () {

      var Chain = function (fn) {
        this.processor = fn;
        this.successor = null;
        this.callback = null;
      };

      Chain.prototype.next = function (data) {
        this.callback && this.callback(data);
        return this.successor && this.successor.passRequest(data);
      };

      Chain.prototype.setSuccessor = function (chainObject) {
        return this.successor = chainObject;
      };

      Chain.prototype.passRequest = function () {
        if (!this.processor) return;

        var args = [this.next.bind(this)];
        for (var i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }

        this.processor.apply(this, args);
      };

      /**
       * [all 模仿Promise.all]
       * @param  { Array }   chainArray [所有异步请求]
       * @param  { Function } callback   [回调函数]
       */
      Chain.all = function (chainArray, callback) {
        var length = 0;
        var _sort = [];

        var checkFlag = function () {
          length++;
          if (length === chainArray.length) {
            callback.apply(null, _sort);
          }
        };

        chainArray.map(function (chain, index) {
          chain.callback = function (data) {
            _sort[index] = data;
            checkFlag();
          };
          chain.passRequest();
        });
      };

      /**
       * [race 模仿Promise.race]
       * @param  { Array }   chainArray [所有异步请求]
       * @param  { Function } callback   [回调函数]
       */
      Chain.race = function (chainArray, callback) {
        var isDone = false;
        chainArray.map(function (chain, index) {
          chain.callback = function (data) {
            if (!isDone) {
              isDone = !isDone;
              callback(data);
            }
          };
          chain.passRequest();
        });
      };

      return Chain;

    })();

    /* 手动实现原型继承 -- 寄生组合继承 */
    nojsja["InheritProtype"] = function (subObject, superObject){

          // 通过过度函数创建实例对象的方法
          function inheritObject (obj){

              // 声明干净的过度函数
              function F(){ }

              // 获取原型链
              F.prototype = obj;

              // 继承属性的过度类实例对象
              return new F();
          }

          // 此步中重写子类原型导致了子类实例对象不是子类的实例instanceof 为false
          // o是一个实例对象
          var o = inheritObject(superObject.prototype);
          // 手动更改子类的原型指向和子类的构造函数
          // 一般原型里面的constructor都是构造函数
          o.constructor = subObject;
          // 这样子子类的原型更改不会影响到父类原型的更改
          // 原型对象的实例只提供了访问原型属性的接口，并不能直接修改原型
          subObject.prototype = o;
    };


    /* 观察者模式方法 */
    nojsja["ObserverPattern"] = (function () {

        // 观察者初始化
        function observerInit(object) {
            // 定义分数模式的观察者回调函数
            object.watcherList = {
                // 没有type类型的trigger使用这个数组
                _list: []
            };
            // 为分数模式注册新的观察者
            object.listen = function (fn, type) {

                if(type){

                    if(!object.watcherList[type]){
                        object.watcherList[type] = [fn];
                    }else {
                        object.watcherList[type].push(fn);
                    }
                }else {
                    object.watcherList._list.push(fn);
                }

            };
            // 被观察者事件触发
            object.trigger = function (type) {

                if(type){

                    if(object.watcherList[type]){
                        for(var i = 0; i < object.watcherList[type].length; i++){
                            object.watcherList[type][i].apply(object);
                        }
                    }else {
                        return false;
                    }

                }else {

                    for(var i = 0; i < object.watcherList._list.length; i++){
                        object.watcherList._list[i].apply(object);
                    }
                }
            };

            // 解绑观察者事件监听
            object.remove = function (fn, type) {

                if(type){

                    var length = object.watcherList[type].length;
                    for(var i = length - 1; i >= 0; i-- ){
                        if(fn === object.watcherList[type][i]){
                            object.watcherList[type].splice(i, 1);
                        }
                    }
                }else {

                    var length = object.watcherList._list.length;
                    for(var i = length - 1; i >= 0; i-- ){
                        if(fn === object.watcherList._list[i]){
                            object.watcherList._list.splice(i, 1);
                        }
                    }
                }

            };
        }

        return {
            init: observerInit
        }
    })();

  /* 观察者模式的类式实现 */
  nojsja["ObserverObject"] = (function() {

    function ObserverObject() {
      this.handlers = {};
    }
    ObserverObject.prototype = {
      constructor: ObserverObject,
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

    return ObserverObject;
  })();

    /* 获取鼠标当前相对于document的绝对坐标 */
    nojsja["GetMousePosition"] = function (event) {

        var e = event || window.event;
        var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
        var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
        var x = e.pageX || (e.clientX + scrollX);
        var y = e.pageY || (e.clientY + scrollY);

        // 返回坐标对象, 即相对于top和left的位置距离
        return { x: x, y: y };
    };

    /* 模态弹窗方法 */
    nojsja["ModalWindow"] = (function () {
        // 初始化标志
        var isInit = false;
        // 激活标致
        var isActive = false;
        var modal, modalContent, acceptButton, contentP,
            selfDefineDiv, closeButton, showTimer, hiddenTimer;

        // 组件初始化事件
        function modalInit() {
            isInit = true;
            // 整个弹窗组件
            modal = document.getElementById('ModalWindow');
            // 显示的主要内容
            modalContent = document.getElementById('ModalContent');
            acceptButton = document.getElementById('modalAccept');
            closeButton = document.getElementById('modalClose');
            // 显示的文字信息
            contentP = document.getElementById('contentText');
            // 自定义组件的父级div
            selfDefineDiv = document.getElementById('selfDefineDiv');

            // 绑定点击关闭事件
            acceptButton.onclick = function () {
                modalHidden();
            };
            closeButton.onclick = function () {
              modalHidden();
            };
        }

        // 模态窗口弹出
        function modalShow(text, condition) {

            if(isActive){
                modalHidden();
                return setTimeout(function () {
                    modalShow(text, condition);
                }, 1000);
            }


            // 激活
            isActive = true;
            // 初始化检测
            if(!isInit){
                modalInit();
            }

            // 禁用窗口的滚动事件，这儿其实应该阻止事件冒泡
            // 可以手动传参设置可不可滚动
            if(!condition || !condition.scroll){

                nojsja.ScrollHandler.disableScroll();
            }

            // 清除自定义DOM
            if(!condition || !condition.selfDefineKeep){

                selfDefineRemove();
            }

            contentP.innerText = text;
            // 设置透明度和初始位置
            modalContent.style.opacity = 0;
            // 注意'px'两个字符还要占用两个长度，这是字符串转化为数字
            modalContent.style.top =
                Number(modalContent.style.top.substr(0, modalContent.style.top.length - 2)) + 20 + 'px';

            var opacityValue = 0.0;
            modal.style.display = 'block';
            // 弹出动画效果
            // 注意JavaScript中小数想加的时候可能会舍去
            function popAnimation() {
                if(modalContent.style.opacity == 1){
                    clearInterval(showTimer);
                }else {
                    opacityValue += 5.0;
                    var topValue = Number(modalContent.style.top.substr(0, modalContent.style.top.length - 2));
                    // 动画函数一共会调用20次
                    modalContent.style.top = topValue - ( 20 / (100 / 5))  + 'px';
                    modalContent.style.opacity = opacityValue / 100;

                }
            }
            showTimer = setInterval(popAnimation, 10);
        }

        /* 添加自定义组件到modalWindow */
        function selfDefine(defineHtml) {

            if(!isInit){
                modalInit();
            }

            selfDefineRemove();

            selfDefineDiv.appendChild(defineHtml);
        }

        /* 清除自定义组件 */
        function selfDefineRemove() {
            for(var i = 0; i < selfDefineDiv.childNodes.length; i++){
                selfDefineDiv.removeChild(selfDefineDiv.childNodes[0]);
            }
        }

        // 模态窗口隐藏
        function modalHidden() {

            // 激活标志
            isActive = false;
            // 初始化检测
            if(!isInit){
                modalInit();
            }

            // 启用滚动
            nojsja.ScrollHandler.enableScroll();

            // 设置透明度和初始位置
            modalContent.style.opacity = 1;
            // 注意'px'两个字符还要占用两个长度，这是字符串转化为数字

            var opacityValue = 100.0;
            // 弹出动画效果
            // 注意JavaScript中小数想加的时候可能会舍去
            function pushAnimation() {
                if(modalContent.style.opacity == 0){
                    modal.style.display = 'none';
                    modalContent.style.top = 0 + 'px';
                    clearInterval(hiddenTimer);
                }else {
                    opacityValue -= 5.0;
                    var topValue = Number(modalContent.style.top.substr(0, modalContent.style.top.length - 2));
                    // 动画函数一共会调用20次
                    modalContent.style.top = topValue + ( 20 / (100 / 5))  + 'px';
                    modalContent.style.opacity = opacityValue / 100;

                }
            }
            hiddenTimer = setInterval(pushAnimation, 10);
        }

        // 返回调用接口
        return {
            show: modalShow,
            define: selfDefine,
            hidden: modalHidden
        }

    })();

    /**
     * [SlideView  图片轮播组件 使用定时器的版本]
     * @return {Function}
     * */
    nojsja["SlideView"] = (function () {

        /**
         * [SlideView 构造函数]
         * @param {String} docWrapper [滑动组件的父对象ID，用于定位组件]
         * @param {[{imageUrl, text}]} imageArray [用于构造组件的图片和与之对应的文字数据]
         * */
        var SlideView = function (domWrapperID, imageArray) {

            var that = this;
            this.domWrapperID = domWrapperID;
            this.slideInfo  = null     /** @type {Object} [滑动组件数据和方法] */
            this.slideTimer = null;     /** @type {Object} [滑动定时器] */
            this.autoTimer = null      /** @type {Object} [自动滑动定时器] */
            this.slideItemList = null;      /** @type {DomObject} [承载图片列表的dom元素] */
            this.slideText = null;      /** @type {DOmObject} [每张图片配套的文字] */
            this.pointList = null;      /** @type {DomObject} [承载小点的dom元素] */
            this.slideAction = null;        /** @type {Function} [图片循环滑动的事件]*/

            this.slideInfo  = {     /** @type {Object} [滑动组件数据和方法] */
            imageArray: [],
                nowIndex: 0,        // 当前显示的图片位于imageArray的编号
                nowSlide: null,     // 当前滚动的部件
                nextIndex: 0,       // 下一张需要显示的图片位于imageArray的编号
                nextSlide: null,        // 下一个滚动的部件
                direction: 'left',      // 滚动方向
                stepWidth: 5,       // 步进值 5px
                stepDuration: 25,       // 步进间隔 25ms
                X_left: 0,      // 滑动初始位置
                targetPos: null,        // 滚动的目标位置
                imageWidth: 0,      // 需要滚动的宽度[定值]
                offsetWidth: 0,     // 需要滚动的宽度[变量]
                imageHeight: 0,     // 滚动的高度
                status: false,      // 是否正在滚动
                touch: {        // 移动端触摸数据
                    pageStartX: 0,      // 起始x坐标
                    pageStartY: 0,      // 起始y坐标
                    pageEndX: 0,        // 终点x坐标
                    pageEndY: 0     // 终点y坐标
                },

                // 触摸事件 判断手指是左边滑动还是右边滑动
                touchMoveCheck: function (pageEndX, pageEndY) {

                    this.touch.pageEndX = pageEndX;
                    this.touch.pageEndY = pageEndY;
                    // 向右滑动
                    if(Math.abs(pageEndX - this.touch.pageStartX) >
                        Math.abs(pageEndY - this.touch.pageStartY) &&
                        (pageEndX - this.touch.pageStartX > 0) ){

                        that.slideAction('right');
                    }
                    // 向左滑动
                    if(Math.abs(pageEndX - this.touch.pageStartX) >
                        Math.abs(pageEndY - this.touch.pageStartY) &&
                        (pageEndX - this.touch.pageStartX < 0) ){

                        that.slideAction('left');
                    }
                }
            };

            this.slideInfo.imageWidth = document.querySelector('#' + domWrapperID + ' #slideWrapper').offsetWidth;
            this.slideInfo.imageHeight = document.querySelector('#' + domWrapperID + ' #slideWrapper').offsetHeight;
            this.slideInfo.imageArray = imageArray;

            // dom选择
            this.slideItemList = document.querySelector('#' + domWrapperID + ' #slideItemList');
            this.slideText = document.querySelector('#' + domWrapperID + ' #slideText');
            this.pointList = document.querySelector('#' + domWrapperID + ' #pointList');

            // 注意分离事件处理程序和应用逻辑 //

            // 移动端滑动事件绑定
            nojsja['EventUtil'].addHandler(this.slideItemList, 'touchstart', function (event) {

                // 函数去抖
                nojsja["FnDelay"](function (_event) {

                    var event = nojsja['EventUtil'].getEvent(_event);
                    // 阻止浏览器默认的事件
                    nojsja['EventUtil'].preventDefault(event);
                    // 当前事件手指的坐标
                    that.slideInfo.touch.pageStartX = event.changedTouches[0].pageX;
                    that.slideInfo.touch.pageStartY = event.changedTouches[0].pageY;

                }, 100, false, event);
            });
            nojsja['EventUtil'].addHandler(this.slideItemList, 'touchmove', function (event) {

                // 函数去抖
                nojsja["FnDelay"](function (_event) {

                    var event = nojsja['EventUtil'].getEvent(_event);
                    // 阻止浏览器默认的事件
                    nojsja['EventUtil'].preventDefault(event);

                    that.slideInfo.touchMoveCheck(event.changedTouches[0].pageX, event.changedTouches[0].pageY);

                }, 200, false, event);

            });
        };

        /**
         * [build  对象方法用于创建滑动视图]
         * */
        SlideView.prototype.build = function () {

            var that = this;
            // 添加图片
            for(var i = 0; i < this.slideInfo.imageArray.length;  i++){
                (function (i) {
                    // 创建图片DOM
                    var slideItem  = document.createElement('div');
                    slideItem.setAttribute('class', 'slide-item');
                    slideItem.setAttribute('id', 'slide' + i);

                    var slideImage = document.createElement('img');
                    slideImage.setAttribute('src', that.slideInfo.imageArray[i].imageUrl);

                    // 事件绑定
                    nojsja['EventUtil'].addHandler(slideItem, 'mouseover', function () {
                        that.slideText.innerText  = that.slideInfo.imageArray[i].text;
                        that.slideText.style.display = 'block';
                    });
                    nojsja['EventUtil'].addHandler(slideItem, 'mouseout', function () {
                        that.slideText.style.display = 'none';
                    });

                    // 添加图片DOM
                    slideItem.appendChild(slideImage);
                    that.slideItemList.appendChild(slideItem);

                    // 创建滚动小点
                    var point = document.createElement('div');
                    point.setAttribute('id', 'point' + i);
                    point.setAttribute('class', 'slide-point');
                    if(i == 0){
                        point.style['background-color'] = '#4e6672';
                    }
                    // 添加小白点DOM
                    that.pointList.appendChild(point);
                })(i);
            }
            // 绑定滚动触发事件
            var triggerLeft = document.querySelector('#' + that.domWrapperID + ' #triggerLeft');
            var triggerRight = document.querySelector('#' + that.domWrapperID + ' #triggerRight');
            nojsja['EventUtil'].addHandler(triggerLeft, 'click', function () {
                that.slideAction('left');
            });
            nojsja['EventUtil'].addHandler(triggerRight, 'click', function () {
                that.slideAction('right');
            });

            // 6s自动轮播
            // 循环滚动方法
            function slideRoll() {
                // 正在轮播
                if(that.slideInfo.status){
                    return;
                }
                that.slideAction('right');
            }
            // 绑定自动轮播事件
            that.autoTimer = setInterval(slideRoll, 10000);
            nojsja['EventUtil'].addHandler(this.slideItemList, 'mouseover', function () {
                clearInterval(that.autoTimer);
            });
            nojsja['EventUtil'].addHandler(this.slideItemList, 'touchstart', function () {
                clearInterval(that.autoTimer);
            });
            nojsja['EventUtil'].addHandler(this.slideItemList, 'touchend', function () {
                that.autoTimer = setInterval(slideRoll, 10000);
            });
            nojsja['EventUtil'].addHandler(this.slideItemList, 'mouseout', function () {
                that.autoTimer = setInterval(slideRoll, 10000);
            });
            // 窗口大小变化时触发的函数
            window.onresize = function () {
                this.slideInfo.imageWidth = document.querySelector('#' + that.domWrapperID + ' #slideWrapper').offsetWidth;
                this.slideInfo.imageHeight = document.querySelector('#' + that.domWrapperID + ' #slideWrapper').offsetHeight;
            }

            /**
             * [slideAction 滚动事件]
             * @param {String} direction [指示滚动方向]
             * */
            that.slideAction = function(direction) {

                // 动画触发的时候不能点击
                if(that.slideInfo.status){
                    return;
                }
                // direction滚动方向
                if(direction == 'left'){

                    that.slideInfo.nextIndex =
                        (that.slideInfo.nowIndex == that.slideInfo.imageArray.length - 1) ? 0 : (that.slideInfo.nowIndex + 1);
                }else {

                    that.slideInfo.nextIndex =
                        (that.slideInfo.nowIndex == 0) ? that.slideInfo.imageArray.length - 1 : (that.slideInfo.nowIndex - 1);
                }


                // 除了nowIndex和nextIndex之外的所有元素隐藏
                // 后面的图片在第一张图片后一字排开
                for(var i = 0; i < that.slideInfo.imageArray.length; i++){

                    (function (i) {
                        that.slideInfo.imageArray[i].offsetHeight = i * that.slideInfo.imageHeight;
                    })(i);
                }

                // 当前滚动部件
                that.slideInfo.nowSlide = document.querySelector('#' + that.domWrapperID +' #slide' + that.slideInfo.nowIndex);
                that.slideInfo.nextSlide = document.querySelector('#' + that.domWrapperID +' #slide' + that.slideInfo.nextIndex);
                // 在一定时间内移动X坐标
                // 目标位置
                that.slideInfo.targetPos = direction == 'left' ?
                    Number(that.slideInfo.nowSlide.style.left.substr(0, that.slideInfo.nowSlide.style.left.length - 2)) - that.slideInfo.imageWidth :
                    Number(that.slideInfo.nowSlide.style.left.substr(0, that.slideInfo.nowSlide.style.left.length - 2)) + that.slideInfo.imageWidth;

                that.slideInfo.offsetWidth = that.slideInfo.imageWidth;

                /**
                 * [slideLeft 向左边移动步进值 多次被调用]
                 * */
                function slideLeft() {
                    that.slideInfo.status = true;
                    that.slideInfo.X_left -= that.slideInfo.stepWidth;
                    that.slideInfo.nowSlide.style.left = that.slideInfo.X_left + 'px';
                    that.slideInfo.nextSlide.style.left = that.slideInfo.X_left + that.slideInfo.imageWidth + 'px';
                    that.slideInfo.nextSlide.style.top = -that.slideInfo.imageArray[that.slideInfo.nextIndex].offsetHeight + 'px';

                    if((that.slideInfo.offsetWidth -= that.slideInfo.stepWidth ) <= 0){
                        // 进行误差调教
                        that.slideInfo.nowSlide.style.left = that.slideInfo.targetPos + 'px';
                        that.slideInfo.nextSlide.style.left = that.slideInfo.targetPos + that.slideInfo.imageWidth + 'px';

                        document.querySelector('#' + that.domWrapperID + ' #point' + that.slideInfo.nowIndex).style['background-color'] = '#FFFFFF'
                        // 滚动完成  改变当前滑动组件和下一个滑动组件的索引[关键算法]
                        that.slideInfo.nowIndex = that.slideInfo.nextIndex;
                        document.querySelector('#' + that.domWrapperID + ' #point' + that.slideInfo.nowIndex).style['background-color'] = '#4e6672'
                        that.slideInfo.status = false;
                        that.slideInfo.X_left = 0;

                        clearInterval(that.slideTimer);
                    }
                }

                /**
                 * [slideRight 向右边边移动步进值 多次被调用]
                 * */
                function slideRight() {

                    that.slideInfo.status = true;

                    that.slideInfo.X_left += that.slideInfo.stepWidth;
                    that.slideInfo.nowSlide.style.left = that.slideInfo.X_left + 'px';
                    that.slideInfo.nextSlide.style.left = that.slideInfo.X_left - that.slideInfo.imageWidth + 'px';
                    that.slideInfo.nextSlide.style.top = -that.slideInfo.imageArray[that.slideInfo.nextIndex].offsetHeight + 'px';

                    if((that.slideInfo.offsetWidth -= that.slideInfo.stepWidth ) <= 0){
                        // 进行误差调教
                        that.slideInfo.nowSlide.style.left = that.slideInfo.targetPos + 'px';
                        that.slideInfo.nextSlide.style.left = that.slideInfo.targetPos - that.slideInfo.imageWidth + 'px';

                        document.querySelector('#' + that.domWrapperID + ' #point' + that.slideInfo.nowIndex).style['background-color'] = '#FFFFFF'
                        // 滚动完成
                        that.slideInfo.nowIndex = that.slideInfo.nextIndex;
                        document.querySelector('#' + that.domWrapperID + ' #point' + that.slideInfo.nowIndex).style['background-color'] = '#4e6672'
                        that.slideInfo.status = false;
                        that.slideInfo.X_left = 0;

                        clearInterval(that.slideTimer);
                    }
                }

                if(direction == 'left'){

                    that.slideTimer = setInterval(function () {
                        // 两个像素点
                        slideLeft();
                    }, that.slideInfo.stepDuration);
                }else {

                    that.slideTimer = setInterval(function () {
                        // 两个像素点
                        slideRight();
                    }, that.slideInfo.stepDuration);
                }
            }
        };

        // 返回一个构造函数
        return SlideView;
    })();

    /**
     * [SlideViewFrame  图片轮播组件 requestAnimationFrame新特性版本]
     * @return {Function}
     * */
    nojsja["SlideViewFrame"] = (function () {

        /**
         * [SlideView 构造函数]
         * @param {String} docWrapper [滑动组件的父对象ID，用于定位组件]
         * @param {[{imageUrl, text}]} imageArray [用于构造组件的图片和与之对应的文字数据]
         * */
        var SlideView = function (domWrapperID, imageArray) {

            var that = this;
            this.domWrapperID = domWrapperID;
            this.slideInfo  = null     /** @type {Object} [滑动组件数据和方法] */
            this.slideTimer = null;     /** @type {Object} [滑动定时器] */
            this.autoTimer = null      /** @type {Object} [自动滑动定时器] */
            this.slideItemList = null;      /** @type {DomObject} [承载图片列表的dom元素] */
            this.slideText = null;      /** @type {DOmObject} [每张图片配套的文字] */
            this.pointList = null;      /** @type {DomObject} [承载小点的dom元素] */
            this.slideAction = null;        /** @type {Function} [图片循环滑动的事件]*/

            this.slideInfo  = {     /** @type {Object} [滑动组件数据和方法] */
                imageArray: [],
                nowIndex: 0,        // 当前显示的图片位于imageArray的编号
                nowSlide: null,     // 当前滚动的部件
                nextIndex: 0,       // 下一张需要显示的图片位于imageArray的编号
                nextSlide: null,        // 下一个滚动的部件
                direction: 'left',      // 滚动方向
                stepWidth: 5,       // 步进值 5px
                stepDuration: 25,       // 步进间隔 25ms
                X_left: 0,      // 滑动初始位置
                targetPos: null,        // 滚动的目标位置
                imageWidth: 0,      // 需要滚动的宽度[定值]
                offsetWidth: 0,     // 需要滚动的宽度[变量]
                imageHeight: 0,     // 滚动的高度
                status: false,      // 是否正在滚动
                touch: {        // 移动端触摸数据
                    pageStartX: 0,      // 起始x坐标
                    pageStartY: 0,      // 起始y坐标
                    pageEndX: 0,        // 终点x坐标
                    pageEndY: 0     // 终点y坐标
                },

                // 触摸事件 判断手指是左边滑动还是右边滑动
                touchMoveCheck: function (pageEndX, pageEndY) {

                    this.touch.pageEndX = pageEndX;
                    this.touch.pageEndY = pageEndY;
                    // 向右滑动
                    if(Math.abs(pageEndX - this.touch.pageStartX) >
                        Math.abs(pageEndY - this.touch.pageStartY) &&
                        (pageEndX - this.touch.pageStartX > 0) ){

                        that.slideAction('right');
                    }
                    // 向左滑动
                    if(Math.abs(pageEndX - this.touch.pageStartX) >
                        Math.abs(pageEndY - this.touch.pageStartY) &&
                        (pageEndX - this.touch.pageStartX < 0) ){

                        that.slideAction('left');
                    }
                }
            };

            this.slideInfo.imageWidth = document.querySelector('#' + domWrapperID + ' #slideWrapper').offsetWidth;
            this.slideInfo.imageHeight = document.querySelector('#' + domWrapperID + ' #slideWrapper').offsetHeight;
            this.slideInfo.imageArray = imageArray;

            // dom选择
            this.slideItemList = document.querySelector('#' + domWrapperID + ' #slideItemList');
            this.slideText = document.querySelector('#' + domWrapperID + ' #slideText');
            this.pointList = document.querySelector('#' + domWrapperID + ' #pointList');

            // 注意分离事件处理程序和应用逻辑 //

            // 移动端滑动事件绑定
            nojsja['EventUtil'].addHandler(this.slideItemList, 'touchstart', function (event) {

                // 函数去抖
                nojsja["FnDelay"](function (_event) {

                    var event = nojsja['EventUtil'].getEvent(_event);
                    // 阻止浏览器默认的事件
                    nojsja['EventUtil'].preventDefault(event);
                    // 当前事件手指的坐标
                    that.slideInfo.touch.pageStartX = event.changedTouches[0].pageX;
                    that.slideInfo.touch.pageStartY = event.changedTouches[0].pageY;

                }, 100, false, event);
            });
            nojsja['EventUtil'].addHandler(this.slideItemList, 'touchmove', function (event) {

                // 函数去抖
                nojsja["FnDelay"](function (_event) {

                    var event = nojsja['EventUtil'].getEvent(_event);
                    // 阻止浏览器默认的事件
                    nojsja['EventUtil'].preventDefault(event);

                    that.slideInfo.touchMoveCheck(event.changedTouches[0].pageX, event.changedTouches[0].pageY);

                }, 200, false, event);

            });
        };

        /**
         * [build  对象方法用于创建滑动视图]
         * */
        SlideView.prototype.build = function () {

            var that = this;
            // 添加图片
            for(var i = 0; i < this.slideInfo.imageArray.length;  i++){
                (function (i) {
                    // 创建图片DOM
                    var slideItem  = document.createElement('div');
                    slideItem.setAttribute('class', 'slide-item');
                    slideItem.setAttribute('id', 'slide' + i);

                    var slideImage = document.createElement('img');
                    slideImage.setAttribute('src', that.slideInfo.imageArray[i].imageUrl);

                    // 事件绑定
                    nojsja['EventUtil'].addHandler(slideItem, 'mouseover', function () {
                        that.slideText.innerText  = that.slideInfo.imageArray[i].text;
                        that.slideText.style.display = 'block';
                    });
                    nojsja['EventUtil'].addHandler(slideItem, 'mouseout', function () {
                        that.slideText.style.display = 'none';
                    });

                    // 添加图片DOM
                    slideItem.appendChild(slideImage);
                    that.slideItemList.appendChild(slideItem);

                    // 创建滚动小点
                    var point = document.createElement('div');
                    point.setAttribute('id', 'point' + i);
                    point.setAttribute('class', 'slide-point');
                    if(i == 0){
                        point.style['background-color'] = '#4e6672';
                    }
                    // 添加小白点DOM
                    that.pointList.appendChild(point);
                })(i);
            }
            // 绑定滚动触发事件
            var triggerLeft = document.querySelector('#' + that.domWrapperID + ' #triggerLeft');
            var triggerRight = document.querySelector('#' + that.domWrapperID + ' #triggerRight');
            nojsja['EventUtil'].addHandler(triggerLeft, 'click', function () {
                that.slideAction('left');
            });
            nojsja['EventUtil'].addHandler(triggerRight, 'click', function () {
                that.slideAction('right');
            });

            /**
             * 新的动画API 类似定时器
             * */
             var requestAnimationFrame = window.requestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.msRequestAnimationFrame;

             var cancelAnimationFrame = window.cancelAnimationFrame ||
                window.mozCancelAnimationFrame ||
                window.oCancelAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.msCancelAnimationFrame;

            // 6s自动轮播
            // 循环滚动方法
            function slideRoll() {
                // 正在轮播
                if(that.slideInfo.status){
                    return;
                }
                that.slideAction('right');
            }
            // 绑定自动轮播事件
            that.autoTimer = setInterval(slideRoll, 10000);
            nojsja['EventUtil'].addHandler(this.slideItemList, 'mouseover', function () {
                clearInterval(that.autoTimer);
            });
            nojsja['EventUtil'].addHandler(this.slideItemList, 'touchstart', function () {
                clearInterval(that.autoTimer);
            });
            nojsja['EventUtil'].addHandler(this.slideItemList, 'touchend', function () {
                that.autoTimer = setInterval(slideRoll, 10000);
            });
            nojsja['EventUtil'].addHandler(this.slideItemList, 'mouseout', function () {
                that.autoTimer = setInterval(slideRoll, 10000);
            });
            // 窗口大小变化时触发的函数
            window.onresize = function () {
                this.slideInfo.imageWidth = document.querySelector('#' + that.domWrapperID + ' #slideWrapper').offsetWidth;
                this.slideInfo.imageHeight = document.querySelector('#' + that.domWrapperID + ' #slideWrapper').offsetHeight;
            }

            /**
             * [slideAction 滚动事件]
             * @param {String} direction [指示滚动方向]
             * */
            that.slideAction = function(direction) {

                // 动画触发的时候不能点击
                if(that.slideInfo.status){
                    return;
                }
                // direction滚动方向
                if(direction == 'left'){

                    that.slideInfo.nextIndex =
                        (that.slideInfo.nowIndex == that.slideInfo.imageArray.length - 1) ? 0 : (that.slideInfo.nowIndex + 1);
                }else {

                    that.slideInfo.nextIndex =
                        (that.slideInfo.nowIndex == 0) ? that.slideInfo.imageArray.length - 1 : (that.slideInfo.nowIndex - 1);
                }


                // 除了nowIndex和nextIndex之外的所有元素隐藏
                // 后面的图片在第一张图片后一字排开
                for(var i = 0; i < that.slideInfo.imageArray.length; i++){

                    (function (i) {
                        that.slideInfo.imageArray[i].offsetHeight = i * that.slideInfo.imageHeight;
                    })(i);
                }

                // 当前滚动部件
                that.slideInfo.nowSlide = document.querySelector('#' + that.domWrapperID +' #slide' + that.slideInfo.nowIndex);
                that.slideInfo.nextSlide = document.querySelector('#' + that.domWrapperID +' #slide' + that.slideInfo.nextIndex);
                // 在一定时间内移动X坐标
                // 目标位置
                that.slideInfo.targetPos = direction == 'left' ?
                    Number(that.slideInfo.nowSlide.style.left.substr(0, that.slideInfo.nowSlide.style.left.length - 2)) - that.slideInfo.imageWidth :
                    Number(that.slideInfo.nowSlide.style.left.substr(0, that.slideInfo.nowSlide.style.left.length - 2)) + that.slideInfo.imageWidth;

                that.slideInfo.offsetWidth = that.slideInfo.imageWidth;

                /**
                 * [slideLeft 向左边移动步进值 多次被调用]
                 * */
                function slideLeft() {
                    that.slideInfo.status = true;
                    that.slideInfo.X_left -= that.slideInfo.stepWidth;
                    that.slideInfo.nowSlide.style.left = that.slideInfo.X_left + 'px';
                    that.slideInfo.nextSlide.style.left = that.slideInfo.X_left + that.slideInfo.imageWidth + 'px';
                    that.slideInfo.nextSlide.style.top = -that.slideInfo.imageArray[that.slideInfo.nextIndex].offsetHeight + 'px';

                    if((that.slideInfo.offsetWidth -= that.slideInfo.stepWidth ) <= 0){
                        // 进行误差调教
                        that.slideInfo.nowSlide.style.left = that.slideInfo.targetPos + 'px';
                        that.slideInfo.nextSlide.style.left = that.slideInfo.targetPos + that.slideInfo.imageWidth + 'px';

                        document.querySelector('#' + that.domWrapperID + ' #point' + that.slideInfo.nowIndex).style['background-color'] = '#FFFFFF'
                        // 滚动完成  改变当前滑动组件和下一个滑动组件的索引[关键算法]
                        that.slideInfo.nowIndex = that.slideInfo.nextIndex;
                        document.querySelector('#' + that.domWrapperID + ' #point' + that.slideInfo.nowIndex).style['background-color'] = '#4e6672'
                        that.slideInfo.status = false;
                        that.slideInfo.X_left = 0;

                    }else {
                        requestAnimationFrame(arguments.callee);
                    }
                }

                /**
                 * [slideRight 向右边边移动步进值 多次被调用]
                 * */
                function slideRight() {

                    that.slideInfo.status = true;

                    that.slideInfo.X_left += that.slideInfo.stepWidth;
                    that.slideInfo.nowSlide.style.left = that.slideInfo.X_left + 'px';
                    that.slideInfo.nextSlide.style.left = that.slideInfo.X_left - that.slideInfo.imageWidth + 'px';
                    that.slideInfo.nextSlide.style.top = -that.slideInfo.imageArray[that.slideInfo.nextIndex].offsetHeight + 'px';

                    if((that.slideInfo.offsetWidth -= that.slideInfo.stepWidth ) <= 0){
                        // 进行误差调教
                        that.slideInfo.nowSlide.style.left = that.slideInfo.targetPos + 'px';
                        that.slideInfo.nextSlide.style.left = that.slideInfo.targetPos - that.slideInfo.imageWidth + 'px';

                        document.querySelector('#' + that.domWrapperID + ' #point' + that.slideInfo.nowIndex).style['background-color'] = '#FFFFFF'
                        // 滚动完成
                        that.slideInfo.nowIndex = that.slideInfo.nextIndex;
                        document.querySelector('#' + that.domWrapperID + ' #point' + that.slideInfo.nowIndex).style['background-color'] = '#4e6672'
                        that.slideInfo.status = false;
                        that.slideInfo.X_left = 0;

                    }else {
                        requestAnimationFrame(arguments.callee);
                    }
                }

                if(direction == 'left'){
                    requestAnimationFrame(slideLeft);
                }else {
                    requestAnimationFrame(slideRight);
                }
            }
        };

        // 返回一个构造函数
        return SlideView;
    })();

    /* 小工具函数 */
    nojsja["Tool"] = (function () {

        // 获取完整的当前日期 //
        function GetFullDate() {

            var dateArray = [];
            var date = new Date();
            var getMonth = (date.getMonth() + 1 < 10) ? ("0" + (date.getMonth() + 1)) : ("" + (date.getMonth() + 1));
            var getDate = (date.getDate() < 10) ? ("0" + date.getDate()) : ("" +date.getDate());

            dateArray.push(date.getFullYear(), "-", GetDate());

            return (dateArray.join(""));
        }

        /* 获取当前日期 */
        function GetDate() {

            var dateArray = [];
            var date = new Date();
            var getMonth = (date.getMonth() + 1 < 10) ? ("0" + (date.getMonth() + 1)) : ("" + (date.getMonth() + 1));
            var getDate = (date.getDate() < 10) ? ("0" + date.getDate()) : ("" +date.getDate());

            dateArray.push(getMonth, "-", getDate,
                " ", GetTime());

            return (dateArray.join(""));
        }

        /* 获取当前时间 */
        function GetTime() {

            var dateArray = [];
            var date = new Date();
            var getHour = (date.getHours() < 10) ? ("0" + (date.getHours())) : ("" + (date.getHours()));
            var getMinite = (date.getMinutes() < 10) ? ("0" + (date.getMinutes())) : ("" + (date.getMinutes()));
            var getSecond = (date.getSeconds() < 10) ? ("0" + (date.getSeconds())) : ("" + (date.getSeconds()));

            dateArray.push(getHour, ":", getMinite, ":", getSecond);

            return (dateArray.join(""));
        }

        /* ------------------- 函数节流 ------------------- */
        var FnDelay = (function FnDelay(){

            //采用单例模式进行内部封装
            // 存储所有需要调用的函数
            var fnObject = {};

            // 三个参数分别是被调用函数，设置的延迟时间，是否需要立即调用
            return function(fn, delayTime, IsImediate, args){

                // 立即调用
                if(!delayTime || IsImediate){
                    return fn(args);
                }
                // 判断函数是否已经在调用中
                if(fnObject[fn]){
                    return;
                }else {
                    // 定时器
                    var timer = setTimeout(function(){
                        fn(args);
                        //清除定时器
                        clearTimeout(timer);
                        delete(fnObject[fn]);
                    }, delayTime);

                    fnObject[fn] = {
                        "status": 'waitToRun',
                        "delayTime": delayTime,
                        "timer": timer
                    };
                }
            };
        })();

        /* ------------------- 函数去抖 ------------------- */
        var FnSmooth = (function () {
          //采用单例模式进行内部封装
          // 存储所有需要调用的函数
          var fnObject = {};
          // 定时器
          var timer;

          // 三个参数分别是被调用函数，设置的延迟时间，是否需要立即调用
          return function (fn, delayTime, isImediate, args) {

            // 设置定时器方法
            var setTimer = function () {
              timer = setTimeout(function () {
                fn(args);
                //清除定时器
                clearTimeout(timer);
                delete (fnObject[fn]);

              }, delayTime);

              fnObject[fn] = {
                "delayTime": delayTime,
                "timer": timer
              };
            };

            // 立即调用
            if (!delayTime || isImediate) {
              return fn(args);
            }
            // 判断函数是否已经在调用中
            if (fnObject[fn]) {

              clearTimeout(timer);
              // 定时器
              setTimer(fn, delayTime, args);

            } else {

              // 定时器
              setTimer(fn, delayTime, args);

            }
          };
        })();

        // Boolean类型转换函数 //
        function StringToBoolean (string) {

            if(string == "true" && typeof (string) == 'string'){
                return (string = true);
            }
            if(string === true && typeof (string) == 'boolean'){
                return (string = true);
            }
            return (string = false);
        };

        // 获取指定范围内的随机数 //
        function GetRandomNum(Min,Max) {
            // 1.Math.random(); 结果为0-1间的一个随机数(包括0,不包括1) 
            // 2.Math.floor(num); 参数num为一个数值，函数结果为num的整数部分。 
            // 3.Math.round(num); 参数num为一个数值，函数结果为num四舍五入后的整数。
            var Range = Max - Min;
            var Rand = Math.random();
            return(Min + Math.round(Rand * Range));
        }

        //   bytes转换成常用单位   //
        function bytesToSize(bytes) {
         if (bytes === 0) return '0 B';

          var k = 1024;
          var sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
          var i = Math.floor(Math.log(bytes) / Math.log(k));

          return Number(bytes / Math.pow(k, i)).toFixed(0) + ' ' + sizes[i];
         //toPrecision(3) 后面保留一位小数，如1.0GB
         //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
       }


        // html字符编码和解码
        function HTMLEncode(str) {

            var s = "";
            if (str.length == 0) return "";
            s = str.replace(/&/g, "&gt;");
            s = s.replace(/</g, "&lt;");
            s = s.replace(/>/g, "&gt;");
            s = s.replace(/ /g, "&nbsp;");
            s = s.replace(/\'/g, "&#39;");
            s = s.replace(/\"/g, "&quot;");
            s = s.replace(/\n/g, "<br>");
            return s;
        }

        function HTMLDecode(str) {

            var s = "";
            if (str.length === 0) return "";
            s = str.replace(/&gt;/g, "&");
            s = s.replace(/&lt;/g, "<");
            s = s.replace(/&gt;/g, ">");
            s = s.replace(/&nbsp;/g, " ");
            s = s.replace(/&#39;/g, "\'");
            s = s.replace(/&quot;/g, "\"");
            s = s.replace(/<br>/g, "\n");
            return s;
        }

        // 常用符号解码
        function SymbolDecode(str) {
            var s = "";
            if(str.length === 0) return s;

            s = str.replace(/&#34;/g, "\"");

            return s;
        }

        // 识别浏览器
        function GetBrowserType(){

            var userAgent = navigator.userAgent;
            mconsole.log(userAgent);
            // 取得浏览器的userAgent字符串
            var isOpera = userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1;
            // 判断是否Opera浏览器
            if (isOpera) {
                return "Opera"
            };
            // 判断是否Firefox浏览器
            if (userAgent.indexOf("Firefox") > -1) {
                return "FireFox";
            }
            // 识别谷歌浏览器
            if (userAgent.indexOf("Chrome") > -1){
                return "Chrome";
            }
            // 判断是否Safari浏览器
            if (userAgent.indexOf("Safari") > -1) {
                return "Safari";
            }
            // 判断是否IE浏览器
            if (
                (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) ||
                (!!window.ActiveXObject || "ActiveXObject" in window)
            ) {
                return "IE";
            };
            // 新版IE浏览器Edge
            if (userAgent.indexOf("Edge") > -1) {
                return "Edge";
            }

            return "Unknown";
        }

        // 获取数据类型
        function GetDataType(item) {
          // 使用instanceof判断实例的话对iframe的数据不能判断
          // 使用字符串方法判断
          var toString = Object.prototype.toString;
          var typeStr = toString.call(item);
          switch (typeStr) {
            case '[object Array]':
              return 'array';
              break;
            case '[object Object]':
              return 'object';
              break;
            case '[object Function]':
              return 'function';
              break;
            case '[object null]':
              return 'null';
              break;
            case '[object undefined]':
              return 'undefined';
              break;
            case '[object String]':
              return 'string';
              break;
            case '[object Number]':
              return 'number';
              break;
            default:
              return 'unknown'
          }
        }

        /**
         * [deepComparison 深比较]
         * @param  {[any]} data [any]
         * @return {[Boolean]}      [是否相同]
         */
        function deepComparison(data1, data2) {
            var hasOwnProperty = Object.prototype.hasOwnProperty;
        
            // 获取变量类型
            var getType = (d) => {
            if (typeof d === 'object') {
                if (!(d instanceof Object)) {
                return 'null';
                }
                if (d instanceof Date) {
                return 'date';
                }
                if (d instanceof RegExp) {
                return 'regexp';
                }
        
                // object / array //
                return 'object';
            }
            if (d !== d) return 'nan';
            return (typeof d).toLowerCase();
            };
        
            // 基本类型比较
            var is = function(d1, d2, type) {
            if (type === 'nan') return true;
            if (type === 'date' || type === 'regexp') return d1.toString() === d2.toString();
            return (d1 === d2);
            };
        
            // 递归比较
            var compare = function(d1, d2) {
            var type1 = getType(d1);
            var type2 = getType(d2);
        
            if (type1 !== type2) {
                return false;
            }
        
            if (type1 === 'object') {
                var keys1 = Object.keys(d1).filter(k => hasOwnProperty.call(d1, k));
                var keys2 = Object.keys(d2).filter(k => hasOwnProperty.call(d2, k));
                if (keys1.length !== keys2.length) {
                return false;
                }
                for (var i = 0; i < keys1.length; i += 1) {
                if (
                    !keys2.includes(keys1[i]) ||
                    !compare(d1[keys1[i]], d2[keys1[i]])) {
                    return false;
                }
                }
                return true;
            }
            return is(d1, d2, type1);
            };
        
            return compare(data1, data2);
        }

        // 秒钟转化为时分秒的格式
        function SecondsToTime (seconds) {
          var hour, minute, second;
          seconds = parseInt( Number(seconds) );

          var formatData = (num) => {
            num < 10 ?
              num = '0' + num :
              num = num;
            return num;
          }

          if (seconds < 60) {
            return '00:' + formatData(seconds);
          }
          if (seconds < 3600) {
            second = formatData( seconds % 60 );
            minute = formatData( parseInt(seconds / 60) );
            return minute + ":" + second;
          }
          hour = formatData( parseInt(seconds / 3600) );
          minute = formatData( parseInt((seconds % 3600) / 60) );
          second = formatData( parseInt((seconds % 3600) % 60) );

          return hour + ":" + minute + ":" + second;
        }

        // 返回调用接口
        return {
            GetDate: GetDate,
            GetFullDate: GetFullDate,
            GetTime: GetTime,
            FnDelay: FnDelay,
            FnSmooth: FnSmooth,
            DeepComparison: deepComparison,
            BytesToSize: bytesToSize,
            HTMLEncode: HTMLEncode,
            HTMLDecode: HTMLDecode,
            SymbolDecode: SymbolDecode,
            StringToBoolean: StringToBoolean,
            GetRandomNum: GetRandomNum,
            GetBrowserType: GetBrowserType,
            GetDataType: GetDataType,
            SecondsToTime: SecondsToTime
        };
    })();

    /**
     * [GetDocumentHeight 获取页面各种宽高]
     * @author 杨伟(yang.wei@datatom.com)
     * @param target {object} [需要被添加属性的对象]
     * @param type {string} [获取的参数]
     */
    nojsja['GetDocumentHeight'] = function (target, type) {

        if(target && type) {

            if (type == 'clientHeight')
                return target[type] = document.documentElement.clientHeight;

            if (type == 'scrollTop')
                return target[type] = document.documentElement.scrollTop ||
                  document.body.scrollTop;

            if (type == 'scrollHeight') {
                return target[type] = document.documentElement.scrollHeight;
            }
            if (type == 'offsetHeight') {
                return target[type] = document.body.offsetHeight;
            }
        }else {
            return {
                clientHeight: document.documentElement.clientHeight,
                scrollTop: document.documentElement.scrollTop ||
                  document.body.scrollTop,
                scrollHeight: document.documentElement.scrollHeight,
                offsetHeight: document.body.offsetHeight
            };
        }
    };

    /* js函数锁的简单实现 */
    nojsja["FnLocker"] = (function () {

        var lockerFnList = [];

        // 上锁
        function lock(fn) {

            if (lockerFnList.indexOf(fn) > -1){
                return false;
            }
            lockerFnList.push(fn);
            return true;
        }

        // 检查是否上锁
        function check(fn) {

            if(lockerFnList.indexOf(fn) >= 0){
                return true;
            }
            return false;
        }

        // 解除锁定
        function unlock(fn) {

            if(lockerFnList.indexOf(fn) == -1){
                return false;
            }
            lockerFnList.splice(lockerFnList.indexOf(fn), 1);
        }

        return {
            lock: lock,
            check: check,
            unlock: unlock
        };
    })();

    /* 获取当前日期 */
    nojsja["GetDate"] = function getDate() {

        var dateArray = [];
        var date = new Date();
        var getMonth = (date.getMonth() + 1 < 10) ?
                       ("0" + (date.getMonth() + 1)) :
                       ("" + (date.getMonth() + 1));
        var getDate = (date.getDate() < 10) ?
                      ("0" + date.getDate()) :
                      ("" +date.getDate());

        dateArray.push(
                       date.getFullYear(), "-",
                       getMonth, "-", getDate,
                       " ", date.getHours(), ":",
                       date.getMinutes(), ":",
                       date.getSeconds()
                  );

        return (dateArray.join(""));
    };

    /* 节流函数 */
    nojsja["FnDelay"] = (function FnDelay(){

        //采用单例模式进行内部封装
        // 存储所有需要调用的函数
        var fnObject = {};

        // 三个参数分别是被调用函数，设置的延迟时间，是否需要立即调用
        return function(fn, delayTime, IsImediate, args){

            // 立即调用
            if(!delayTime || IsImediate){
                return fn(args);
            }
            // 判断函数是否已经在调用中
            if(fnObject[fn]){
                return;
            }else {
                // 定时器
                var timer = setTimeout(function(){
                    fn(args);
                    //清除定时器
                    clearTimeout(timer);
                    delete(fnObject[fn]);
                }, delayTime);

                fnObject[fn] = {
                    "status": 'waitToRun',
                    "delayTime": delayTime,
                    "timer": timer
                };
            }
        };
    })();

    /* 页面悬浮按钮(后退和返回) */
    nojsja["HoverButton"] = (function () {

        // 模块是否初始化标志
        var isInit = false;
        // 是否点击
        var isClick = false;

        var hoverInit = function () {
            var hoverArea = document.getElementById('hoverArea');
            var goTop = document.getElementById('goTop');
            var returnHistory = document.getElementById('returnHistory');

            // 返回
            if(!hoverArea || !goTop || !returnHistory){
                return;
            }

            // 鼠标放上去
            hoverArea.onclick = function () {
                isClick = !isClick;
                if(isClick){
                    goTop.setAttribute('class',"hover-go-top hover-go-top-show");
                    returnHistory.setAttribute('class',"hover-return-history hover-return-history-show");
                }else {
                    goTop.setAttribute('class', "hover-go-top hover-go-top-hidden");
                    returnHistory.setAttribute('class', "hover-return-history hover-return-history-hidden");
                }
            };

            goTop.onclick = function () {
                scrollTo(0, 0);
            };
            returnHistory.onclick = function (){
                window.history.go(-1);
            };
        };

        /* 返回模块初始化调用接口 */
        return {
            init: hoverInit
        };
    })();

    /* 页面悬浮按钮(后退和返回) */
    nojsja["DanmuColor"] = (function () {

        // 模块是否初始化标志
        var isInit = false;
        // 是否点击
        var isClick = false;
        // 按钮组
        var danmuColorArray = [];
        // 返回的danmu对象
        var danmuObject = {};
        // 按钮组件
        var danmuWrapper, danmuColorHover, danmuSend, danmuCancel, danmuText;

        // 组件初始化
        function danmuColorInit() {

            if(isInit){
                return;
            }else {
                isInit = !isInit;
            }
            // 选择器
            danmuWrapper = document.getElementById('danmuWrapper')
            danmuColorHover = document.getElementById('danmuColorHover');
            danmuSend = document.getElementById('danmuSend');
            danmuCancel = document.getElementById('danmuCancel');
            danmuText = document.getElementById('danmuText');

            // 获取颜色选择对象
            for(var i = 0; i < 6; i++) {

                (function (i) {
                    var danmuColorObject = document.getElementById('danmuColor' + (i + 1));
                    danmuColorObject.onclick = function () {
                        danmuObject['color'] = danmuColorObject.getAttribute('color');
                         danmuColorArray.forEach(function (obj) {
                            obj.style.borderColor = 'white';
                         });
                         this.style.borderColor = 'red';
                    };
                    danmuColorArray.push(danmuColorObject);

                })(i);
            }

            danmuColorHover.onclick = danmuColorHoverClick;

                // 取消发送
            danmuCancel.onclick = danmuWrapperHidden;
        };

        // 点击选择颜色
        function danmuColorHoverClick() {

            isClick = !isClick;
            if(isClick){

                for(var i = 0; i < danmuColorArray.length; i++){

                    (function (i) {
                        danmuColorArray[i].setAttribute('class', ['danmu-color ' + 'color' + (i + 1), ' danmu-color-show-' + (i + 1)].join(''));
                    })(i);
                }
            }else {

                for(var i = 0; i < danmuColorArray.length; i++){
                    (function (i) {
                        danmuColorArray[i].setAttribute('class', ['danmu-color ' + 'color' + (i + 1), ' danmu-color-hidden'].join(''));
                    })(i);
                }
            }
        }

        // 组件隐藏
        function danmuWrapperHidden() {
            danmuObject = {};
            danmuColorHoverClick();
            danmuWrapper.style.display = 'none';
            danmuWrapper.setAttribute('class', 'danmu-wrapper');
        }

        // 组件显示
        function danmuWrapperShow(callback) {

            if(!isInit){
                danmuColorInit();
            }

            danmuWrapper.style.display = 'block';
            danmuWrapper.setAttribute('class', 'danmu-wrapper danmu-wrapper-show');
            // 触发颜色选择
            danmuColorHoverClick();

            //发送弹幕
            danmuSend.onclick = function () {
                var text = danmuText.value.trim();
                if(text == '' || text == null || text == undefined){
                    return alert('弹幕不能为空！');
                }
                danmuObject['text'] = text;

                callback(danmuObject);
            };

        }

        /* 返回模块初始化调用接口 */
        return {
            init: danmuColorInit,
            hidden: danmuWrapperHidden,
            show: danmuWrapperShow
        };
    })();

    /* 禁用浏览器滚动的方法 */
    nojsja["ScrollHandler"] = (function () {

        // 上下左右的键值码keycode
        var keys = {37: 1, 38: 1, 39: 1, 40: 1};
        // 阻止事件冒泡
        function preventDefault(e) {
            e = e || window.event;
            if (e.preventDefault)
                e.preventDefault();
            e.returnValue = false;
        }

        function preventDefaultForScrollKeys(e) {
            if (keys[e.keyCode]) {
                preventDefault(e);
                return false;
            }
        }

        var oldonwheel, oldonmousewheel1, oldonmousewheel2, oldontouchmove, oldonkeydown
            , isDisabled;

        function disableScroll(object) {

            /* 新旧浏览器适配 */
            if (window.addEventListener) {
                if(object && (typeof object == "object")){
                    object.addEventListener('DOMMouseScroll', preventDefault, false);
                }else {
                    window.addEventListener('DOMMouseScroll', preventDefault, false);
                }
            }// older FF

            // 保存事件
            oldonwheel = window.onwheel;
            oldonmousewheel1 = window.onmousewheel;
            oldonmousewheel2 = document.onmousewheel;
            oldontouchmove = window.ontouchmove;
            oldonkeydown = document.onkeydown;

            if(object && (typeof object == "object")){
                object.onwheel = preventDefault; // modern standard
                object.onmousewheel = preventDefault; // older browsers, IE
                object.onmousewheel = preventDefault; // older browsers, IE
                object.ontouchmove = preventDefault; // mobile
                document.onkeydown = preventDefaultForScrollKeys;
            }else {
                window.onwheel = preventDefault; // modern standard
                window.onmousewheel = preventDefault; // older browsers, IE
                document.onmousewheel = preventDefault; // older browsers, IE
                window.ontouchmove = preventDefault; // mobile
                document.onkeydown = preventDefaultForScrollKeys;
            }
            isDisabled = true;
        }

        function enableScroll(object) {

            if (!isDisabled) return;

            if (window.removeEventListener){
                if(object && (typeof object == "object")){
                    object.removeEventListener('DOMMouseScroll', preventDefault, false);
                }else {
                    window.removeEventListener('DOMMouseScroll', preventDefault, false);
                }
            }

            if(object && (typeof object == "object")){
                object.onwheel = oldonwheel; // modern standard
                object.onmousewheel = oldonmousewheel1; // older browsers, IE
                object.onmousewheel = oldonmousewheel2; // older browsers, IE
                object.ontouchmove = oldontouchmove; // mobile
                document.onkeydown = oldonkeydown;
            }else {
                window.onwheel = oldonwheel; // modern standard
                window.onmousewheel = oldonmousewheel1; // older browsers, IE
                document.onmousewheel = oldonmousewheel2; // older browsers, IE
                window.ontouchmove = oldontouchmove; // mobile
                document.onkeydown = oldonkeydown;
            }

            isDisabled = false;
        }

        return {
            disableScroll: disableScroll,
            enableScroll: enableScroll
        };
    })();

    /**
     * [DanmuPoll 轻量化弹幕池]
     * @return {Object}
     *  */
    nojsja["DanmuPool"] = (function () {

        var _pool = [];     // 存储弹幕对象
        var attrArray = ['color', 'text', 'date', 'user'];      // 弹幕属性
        /**
         * 新的动画API 类似定时器
         * */
        var requestAnimationFrame = window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame;

        var cancelAnimationFrame = window.cancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.msCancelAnimationFrame;

        // 弹幕构造函数
        function danmu() {

            // 定时器
            this.timer = {};
            // 宽度
            this.width = 0;
            var that = this;
            // 初始化DOM
            this.dom = (function (that) {

                var $danmuDiv = $('<div class="danmu-div">');
                var $p = $('<p>');

                $danmuDiv.append($p);
                // 获取位置
                function getPosition() {
                    // 返回距离左上角的绝对坐标
                    return {
                        x: $danmuDiv[0].offsetLeft,
                        y: $danmuDiv[0].offsetTop
                    }
                };
                function setPosition(x, y) {
                    $danmuDiv[0].style.left = x + 'px';
                    $danmuDiv[0].style.top = y + 'px';
                }
                function setPositionX(x) {
                    $danmuDiv[0].style.left = x + 'px';
                }
                // 移动
                function move(_info) {

                    var bodyHeight = danmu.getHeight();
                    var bodyWidth = danmu.getWidth();

                    var positionX = danmu.getWidth();
                    var positionY = nojsja["Tool"].GetRandomNum(parseInt(bodyHeight * 0.15), parseInt(bodyHeight * 0.85));
                    $danmuDiv.prop('class', 'danmu-div danmu-show');
                    if(_info.border){
                        $danmuDiv.css('border', 'solid 1px ' + _info.border);
                    }else {
                        $danmuDiv.css('border', 'solid 0px white');
                    }
                    if(_info.color){
                        $p.css('color', _info.color);
                    }
                    $p.text(_info.text);

                    document.body.appendChild($danmuDiv[0]);

                    setPosition(positionX, positionY);

                    // 循环移动
                    function _move() {

                        setPositionX(bodyWidth = bodyWidth - 1);
                        // 触碰边界后检测
                        if(bodyWidth + that.width <= 0){

                            if(that.width !== 0){
                                return free();
                                // return clearInterval(that.timer);
                            }
                            that.width = $danmuDiv[0].offsetWidth;
                            requestAnimationFrame(arguments.callee);

                        }else {
                            requestAnimationFrame(arguments.callee);
                        }
                    }
                    // that.timer = setInterval(_move, 15);
                    requestAnimationFrame(_move);

                };
                // 释放
                function free() {

                    $danmuDiv.prop('class', 'danmu-div danmu-hidden');
                    document.body.removeChild($danmuDiv[0]);
                    that.width = 0;
                    _pool.push(that);
                }

                // 返回调用接口
                return {
                    move: move
                }

            })(that);
        }

        // 获取屏幕高度
        danmu.getWidth = function () {
            // 包括变现的宽度
            return document.body.clientWidth;
        };
        // 获取屏幕宽度
        danmu.getHeight = function () {
            return document.body.clientHeight;
        };

        // 对象继承
        // 获取弹幕的位置
        danmu.prototype.getPosition = function () {
            this.dom.getPosition();
        };
        // 弹幕的移动
        danmu.prototype.move = function (info) {
            this.dom.move(info);
        };
        // 弹幕的释放
        danmu.prototype.free = function () {
            this.dom.free();
        };

        // 获取一个弹幕对象
        function getOne() {
            if(_pool.length == 0){
                var danmuObject = new danmu();
                return danmuObject;

            }else {
                return _pool.pop();
            }
        }

        // 返回调用接口
        return {
            // 获取一个弹幕对象
            get: getOne
        };

    })();

    /* 兼容各个浏览器的事件处理程序 */
    nojsja["EventUtil"] = {
        addEvent: (function(window, undefined) {
          var _eventCompat = function(event) {
              var type = event.type;
              if (type == 'DOMMouseScroll' || type == 'mousewheel') {
                  event.delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
              }
              //alert(event.delta);
              if (event.srcElement && !event.target) {
                  event.target = event.srcElement;
              }
              if (!event.preventDefault && event.returnValue !== undefined) {
                  event.preventDefault = function() {
                      event.returnValue = false;
                  };
              }
              return event;
          };
          if (window.addEventListener) {
              return function(el, type, fn, capture) {
                  if (type === "mousewheel" && document.mozFullScreen !== undefined) {
                      type = "DOMMouseScroll";
                  }
                  el.addEventListener(type, function(event) {
                      fn.call(this, _eventCompat(event));
                  }, capture || false);
              }
          } else if (window.attachEvent) {
              return function(el, type, fn, capture) {
                  el.attachEvent("on" + type, function(event) {
                      event = event || window.event;
                      fn.call(el, _eventCompat(event));
                  });
              }
          }
          return function() {};

        })(window),

        // 添加事件处理
        addHandler: function (element, type, handler, arges) {
            if(element.addEventListener){
                element.addEventListener(type, handler, false);

            }else if(element.attachEvent){
                element.attachEvent('on' + type, handler);

            }else {
                element['on' + type] = handler;
            }
        },

        // 移除事件处理
        removeHandler: function (element, type, handler, arges) {
            if(element.removeEventListener){
                element.removeEventListener(type, handler, false);

            }else if(element.detachEvent){
                element.detachEvent('on' + type, handler);

            }else {
                element['on' + type] = null;
            }
        },

        // 获取事件对象
        getEvent: function (event) {

            return event ? event : window.event;
        },

        // 获取事件目标
        getTarget: function (event) {
            return event.target || event.srcElement;
        },

        // 添加事件代理
        addAgent: function (elem, type, agent, listener) {
            elem.addEventListener(type, function (e) {
                if (e.target.matches(agent)) {
                    listener.call(e.target, e); // this 指向 e.target
                }
            });
        },

        // 阻止默认行为
        preventDefault: function (event) {
            if(event.preventDefault){
                event.preventDefault();
            }else {
                event.returnValue = false;
            }
        },

        // 阻止事件冒泡
        stopPropagation: function (event) {

            if(event.stopPropagation){
                event.stopPropagation();
            }else {
                event.cancelBubble = true;
            }
        }

    };

    /* 发送移动端浏览器调试信息到后台 */
    window['mconsole'] = nojsja['mconsole'] = {
        log: function (data){

            nojsja["AjaxPool"].sendRequest('POST', '/mconsole', JSON.stringify({
                data: data
            }), function (xmlHttpObject) {

                if(xmlHttpObject.responseText){
                    console.log(xmlHttpObject.responseText);
                }
                xmlHttpObject.readyState = 0;
            });
        }
    };


})();
