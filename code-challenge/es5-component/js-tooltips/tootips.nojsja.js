/**
* @name: tootips
* @description: 显示自定义内容和自定义显示方式的tootips
*/

/*
  Example:
  Tootips.init(('#tootipsTest'), {
    trigger: 'mouseover' | 'click',
    context: '' | element,
    type: 'html' | 'text',
    value: '<h3>header</h3><p>body</p>',
    direction: 'right' | 'top' | 'left' | 'bottom',
    style: {
      'font-size': '1rem',
      'color': 'red',
      'display': 'inline-block',
    },
    css: '.your-style-class' | null,
  });
 */

 /* 显示自定义内容和自定义显示方式的tootips  */
 var Tootips = (function () {
   
   var utils = {
     actions: {
       // [symbol]: [Timer]
     },
     element: {
      jsonWrapper: function(target) {
        var jsonParseRule = /^\{"([\w\W])+\}$/;
        if (jsonParseRule.test(target)) return JSON.parse(target);
        return (typeof target === 'object' && target !== null) ?
          JSON.stringify(target) :
          target;
      },
      elementWrapper: function($element) {
        return (typeof $element === 'object') ? $element : document.querySelector($element);
      },
      setAttr: function($element, key, value) {
        $element = this.elementWrapper($element);
        (key) && $element.setAttribute(key, this.jsonWrapper(value));
        return this;
      },
      setCss: function($element, styleKey, styleValue, important) {
        $element = this.elementWrapper($element);
        $element.style.setProperty(styleKey, styleValue, important === 'important' ? important : undefined);
        return this;
      },
      getAttr: function($element, key) {
        $element = this.elementWrapper($element);
        return (key) ? this.jsonWrapper($element.getAttribute(key)) : undefined;
      },
      setData: function($element, key, value) {
        $element = this.elementWrapper($element);
        (key) && this.setAttr($element, 'data-' + key, value);
        return this;
      },
      getData: function($element, key) {
        $element = this.elementWrapper($element);
        return key ? this.getAttr($element, 'data-' + key) : undefined;
      },
      addClass: function($element, className) {
        $element = this.elementWrapper($element);
        var classes = $element.className.split(' ');
        if (!classes.includes(className)) {
          classes.push(className);
          $element.className = classes.join(' ');
        }
        return this;
      },
      removeClass: function($element, className) {
        $element = this.elementWrapper($element);
        var classes = $element.className.split(' ');
        var index = classes.indexOf(className);
        if (index !== -1) {
          classes.splice(index, 1);
          $element.className = classes.join(' ');
        }
        return this;
      },
      empty: function($element) {
        $element = this.elementWrapper($element);
        $element.innerHTML = '';
      },
      html: function($element, htmlStr) {
        $element = this.elementWrapper($element);
        $element.innerHTML = htmlStr;
      },
      stopPropagation: function(event) {
        event = event || window.event;
        if (event.stopPropagation) {
          event.stopPropagation();
        } else {
          event.cancelBubble = true;
        }
      },
     },
    /* 根据宿主元素第一次计算横坐标和纵坐标 */
    renderX1: function (r, d) {
      if (d === 'top' || d === 'bottom')
        return (r.x + r.width / 2 + 'px');
      if (d === 'left')
        return (r.x - 6 + 'px');
      if (d === 'right')
        return (r.x + r.width + 6 + 'px');
      if (d === 'bottomleft' || d === 'topleft')
        return (r.x + 'px');
      if (d === 'bottomright' || d === 'topright')
        return (r.x + r.width + 'px');
    },
    renderY1: function (r, d) {
      if (d === 'top')
        return (r.y - 6 + 'px');
      if (d === 'left' || d === 'right')
        return (r.y + r.height / 2 + 'px');
      if (d === 'bottom')
        return (r.y + r.height + 6 + 'px');
      if (d === 'bottomleft' || d === 'bottomright')
        return (r.y + r.height + 'px');
      if (d === 'topleft' || d === 'topright')
        return (r.y + 'px');
    },
    /* 根据生成的tootips元素宽高第二次计算横坐标和纵坐标 */
    renderX2: function (r, d) {
      if (d === 'top' || d === 'bottom')
        return (r.x - r.width / 2 + 'px');
      if (d === 'left' || d === 'bottomleft' || d === 'topleft')
        return (r.x - r.width + 'px');
      if (d === 'right')
        return (r.x + 'px');
      if (d === 'bottomright' || d === 'topright')
       return (r.x + r.widht + 'px');
    },
    renderY2: renderY = function (r, d) {
      if (d === 'top' || d === 'topleft' || d === 'topright')
        return (r.y - r.height + 'px');
      if (d === 'left' || d === 'right')
        return (r.y - r.height / 2 + 'px');
      if (d === 'bottom' || d === 'bottomleft' || d === 'bottomright')
        return (r.y + 'px');
    },
    /* 使用函数去抖防止调用混乱 */
    actionDebounce: function(symbol, action, params, time) {
      var that = this;
      var timer = setTimeout(function() {
        action(params);
        clearTimeout(timer);
        delete that.actions[symbol];
      }, time || 300);
  
      if (!that.actions[symbol]) {
        that.actions[symbol] = timer;
      } else {
        clearTimeout(that.actions[symbol]);
        that.actions[symbol] = timer;
      }
    }
  }
  

   /**
    * [renderContainer 构造html]
    * @param  {[Object]} options   [自定义参数]
    * @param  {[String]} type   [渲染类型 -> text | html]
    * @param  {[String]} target   [渲染字符串]
    */
   function renderContainer($selector, tootipKey) {
    var type = utils.element.getData($selector, 'tootip-type'),
       options = utils.element.getData($selector, 'tootip-options'),
       trigger = utils.element.getData($selector, 'tootip-trigger'),
       target = utils.element.getData($selector, 'tootip-target');

    // 提取属性
    var randomKey = '_' + Math.random().toString(36).substr(2);
    var $wrapper = tootipKey ? utils.element.elementWrapper('div[tootip-key='+tootipKey+']') : document.createElement('div');
    var cssStyle = options.style || {};
    var styleSheet = options.css || '';
    var direction = options.direction || 'top';
    var triangleArray = ['top', 'left', 'right','bottom'];
    var triangleClass = 'triangle-' +
      triangleArray[triangleArray.length - 1 - triangleArray.indexOf(direction)];
    var shadowClassMap = {
      top: 'tootip-shadow-top-right',
      bottom: 'tootip-shadow-bottom-right',
      left: 'tootip-shadow-top-left',
      right: 'tootip-shadow-top-right',
    }
    var rect = $selector.getBoundingClientRect();

    utils.element.setCss($wrapper, 'border', 'solid 1px rgb(212, 212, 212)')
     .setCss($wrapper, 'position', 'fixed')
     .setCss($wrapper, 'z-index', '10000')
     .setCss($wrapper, 'left', utils.renderX1(rect, direction))
     .setCss($wrapper, 'top', utils.renderY1(rect, direction))
     .setAttr($wrapper, 'tootip-key', tootipKey || randomKey)
     .addClass($wrapper, triangleClass + ' abnormal-tips-container ' + shadowClassMap[direction] + ' ' + styleSheet);
     utils.element.setAttr($selector, 'tootip-key', tootipKey || randomKey);

    // 第一次创建dom结构
    if (!tootipKey && trigger === 'mouseover') {
      $wrapper.onmouseout = function () {
        utils.actionDebounce(randomKey, hideTooTips, $selector);
      };
      $wrapper.onmouseover = function () {
        utils.actionDebounce(randomKey, showTootips, $selector);
      };
    }

    Object.keys(cssStyle).forEach(function (attr) {
      utils.element.setCss($wrapper, attr, cssStyle[attr]);
    });

    utils.element.html($wrapper, type === 'html' ? target : ('<span>' + target +'</span>'));

    return $wrapper;
  };


  /**
   * [showTootips 操作页面属性显示一个元素]
   * @param  {[$Object]} $selector [一个页面元素]
   * @param  {[String]} tootipKey [可能已经生成过一次tooptips组件了]
   */
  function showTootips($selector) {
    if (utils.element.getData($selector, 'isActivated')) return;
    var tootipKey = utils.element.getAttr($selector, 'tootip-key');
    var $dom = renderContainer($selector, tootipKey);
    if (!tootipKey) {
      document.body.appendChild($dom);
    } else {
     utils.element.removeClass($dom, 'hidden');
    }
    utils.element.setData($selector, 'isActivated', true);

    var options = utils.element.getData($selector, 'tootip-options');
    var rect = $dom.getBoundingClientRect();

    utils.element
      .setCss($dom, 'top', utils.renderY2(rect, options.direction))
      .setCss($dom, 'left', utils.renderX2(rect, options.direction));
  };

  /**
   * [hideTooTips 操作页面属性隐藏一个元素]
   * @param  {[$Object]} $selector [一个页面元素]
   */
  function hideTooTips($selector) {
    var key = utils.element.getAttr($selector, 'tootip-key');
    var $element = utils.element.elementWrapper('div[tootip-key='+key+']');
    utils.element.addClass($element, 'hidden');
    utils.element.setData($selector, 'isActivated', '');
  };


  /**
   * [eventListen 进行事件监听]
   * @param  {[$Object]} $selector [一个页面元素]
   * @param  {[String]} trigger [触发事件监听类型]
   */
  function eventListen($selector, _trigger, $context) {

    var trigger = (_trigger instanceof Array) ? _trigger : [_trigger];

    // click事件监听
    if(trigger.includes('click')) {
      ($context || $selector)
        .onclick = function (ev) {
          utils.element.stopPropagation(ev);
          if (!utils.element.getData($selector, 'isActivated')) {
            utils.actionDebounce(utils.element.getAttr($selector, 'tootip-key'), showTootips, $selector);
          } else {
            utils.actionDebounce(utils.element.getAttr($selector, 'tootip-key'), hideTooTips, $selector);
          }
        };
    } 

    // 鼠标事件监听
    if(trigger.includes('mouseover')) {
      ($context || $selector)
        .onmouseout = function (ev) {
          utils.element.stopPropagation(ev);
          utils.actionDebounce(utils.element.getAttr($selector, 'tootip-key'), hideTooTips, $selector);
        };
      ($context || $selector)
        .onmouseover = function (ev) {
          utils.element.stopPropagation(ev);
          utils.actionDebounce(utils.element.getAttr($selector, 'tootip-key'), showTootips, $selector);
        };
    }
  }


  /**
   * [resize 重新定位]
   * @param  {[$Object]} $selector [一个页面元素]
   */
  function resize($selector) {
    $selector = utils.element.elementWrapper($selector);
    if (!utils.element.getData($selector, 'isActivated')) return;
    var tootipKey = utils.element.getAttr($selector, 'tootip-key');
    var $dom = utils.element.elementWrapper('div[tootip-key='+tootipKey+']');
    var rect1 = $selector.getBoundingClientRect();
    var rect2;
    var options = utils.element.getData($selector, 'tootip-options');
    
    utils.element
    .setCss($dom, 'left', utils.renderX1(rect1, options.direction))
    .setCss($dom, 'top', utils.renderY1(rect1, options.direction))
    
    rect2 = $dom.getBoundingClientRect();

    utils.element
      .setCss($dom, 'top', utils.renderY2(rect2, options.direction))
      .setCss($dom, 'left', utils.renderX2(rect2, options.direction));
  }


  /**
   * [renderHtml 使用html字符串进行初始化]
   * @param  {[$Object]} $selector [一个页面元素]
   * @param  {[String]} htmlstr   [html字符串]
   * @param  {[Object]} options   [自定义参数]
   */
  function init(_$selector, _options) {

    var $selector = utils.element.elementWrapper(_$selector),
       trigger = _options['trigger'] ? _options['trigger'] : 'mouseover', // click | hover
       $context = utils.element.elementWrapper(_options['context']),
       key = utils.element.getAttr($selector, 'tootip-key');

    _options.trigger = trigger;
    
    utils.element.setData($selector, 'tootip-target', _options.value)
      .setData($selector, 'tootip-type', _options.type)
      .setData($selector, 'tootip-options', _options)
      .setData($selector, 'tootip-trigger', _options.trigger)
      .setCss($selector, 'cursor', 'pointer');

   (!key) && eventListen($selector, trigger, $context);
  }

  return {
    init: init,
    /**
    * [重新定位元素]
    * @param  {[$Object]} $selector [一个页面元素]
    * @param  {[Number]} time [位置刷新间隔时间]
    */
    resize: function($selector, time) {
      utils.actionDebounce($selector, resize, $selector, time || 200);
    },

    /**
    * [trigger 手动触发元素的显示和隐藏]
    * @param  {[$Object]} $selector [一个页面元素]
    */
    trigger: function($selector) {
     if (!utils.element.getData($selector, 'isActivated')) {
       showTootips($selector, utils.element.getAttr($selector, 'tootip-key'));
     }else {
       hideTooTips($selector);
     }
   },

   /**
   * [getStatus 获取某个元素的状态]
   * @param  {[$Object]} $selector [一个页面元素]
   */
    status: function ($selector) {
     return {
       isActivated: utils.element.getData($selector, 'isActivated') ? true : false,
       isInited: utils.element.getAttr($selector, 'tootip-key') ? true : false,
       key: utils.element.getAttr($selector, 'tootip-key') || null,
     };
   },
  }
 })();