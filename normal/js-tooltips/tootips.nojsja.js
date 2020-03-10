/**
* @name: tootips
* @description: 显示自定义内容和自定义显示方式的tootips
*/

/*
  Example:
  Tootips.init($('#tootipsTest'), {
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

 var Tootips = (function () {

  /**
   * [renderPage 构造html]
   * @param  {[Object]} options   [自定义参数]
   * @param  {[String]} type   [渲染类型 -> text | html]
   * @param  {[String]} target   [渲染字符串]
   */
  function renderPage($selector) {
    var type = $selector.data('tootip-type'),
       options = $selector.data('tootip-options'),
       target = $selector.data('tootip-target');
    // 提取属性
    var randomKey = String(Math.random() + Math.random()).split('.').pop();
    var $wrapper = $('<div></div>');
    var cssStyle = options.style || {};
    var styleSheet = options.css || '';
    var direction = options.direction || 'top';
    var rect = $selector[0].getBoundingClientRect();

    // 根据宿主元素第一次计算横坐标和纵坐标
    var renderX = function (r, d) {
      if (d === 'top' || d === 'bottom')
        return (r.x + r.width / 2 + 'px');
      if (d === 'left')
        return (r.x - 6 + 'px');
      if (d === 'right')
        return (r.x + r.width + 6 + 'px');
    };

    var renderY = function (r, d) {
      if (d === 'top')
        return (r.y - 6 + 'px');
      if (d === 'left' || d === 'right')
        return (r.y + r.height / 2 + 'px');
      if (d === 'bottom')
        return (r.y + r.height + 6 + 'px');
    };

    $wrapper
     .css('position', 'fixed')
     .css('left', renderX(rect, direction))
     .css('top', renderY(rect, direction))
     .attr('tootip-key', randomKey)
     .addClass(styleSheet);
    $selector.attr('tootip-key', randomKey);

    Object.keys(cssStyle).forEach(function (attr) {
      $wrapper.css(attr, cssStyle[attr]);
    });

    $wrapper.append(type === 'html' ? $(target) : $('<span>' + target +'</span>'));

    return $wrapper;
  };

  /**
   * [renderHtml 使用html字符串进行初始化]
   * @param  {[$Object]} $selector [一个页面元素]
   * @param  {[String]} htmlstr   [html字符串]
   * @param  {[Object]} options   [自定义参数]
   */
  function init(_$selector, _options) {

    var $selector = (typeof _$selector === 'object') ? _$selector : $(_$selector),
       trigger = _options['trigger'] ? _options['trigger'] : 'mouseover', // click | hover
       $context = _options['context'],
       key = $selector.attr('tootip-key');
    _options.value && $selector.data('tootip-target', _options.value);
    _options.type && $selector.data('tootip-type', _options.type);
    (!key) && $selector.data('tootip-options', _options);
    (!key) && $selector.css('cursor', 'pointer');

    (!key) && eventListen($selector, trigger, $context);
  }

  /**
    * [trigger 手动触发元素的显示和隐藏]
    * @param  {[$Object]} $selector [一个页面元素]
    */
   function trigger($selector) {
     if (!$selector.data('isActivated')) {
       showTootips($selector);
     }else {
       hideTooTips($selector);
     }
   }

   /**
    * [getStatus 获取某个元素的状态]
    * @param  {[$Object]} $selector [一个页面元素]
    */
   function getStatus($selector) {

     console.log($selector);
     var status = {
       isActivated: $selector.data('isActivated') ? true : false,
       isInited: $selector.attr('tootip-key') ? true : false,
       key: $selector.attr('tootip-key') || null,
     };
     return status;
   }

  /**
   * [showTootips 操作页面属性显示一个元素]
   * @param  {[$Object]} $selector [一个页面元素]
   */
  function showTootips($selector) {
    var $dom = renderPage($selector);
    $('body').append($dom[0]);
    $selector.data('isActivated', true);

    // 根据生成的tootips元素第二次计算横坐标和纵坐标
    var options = $selector.data('tootip-options');
    var rect = $dom[0].getBoundingClientRect();

    var renderX = function (r, d) {
      if (d === 'top' || d === 'bottom')
        return (r.x - r.width / 2 + 'px');
      if (d === 'left')
        return (r.x - r.width + 'px');
      if (d === 'right')
        return (r.x + 'px');
    };

    var renderY = function (r, d) {
      if (d === 'top')
        return (r.y - r.height + 'px');
      if (d === 'left' || d === 'right')
        return (r.y - r.height / 2 + 'px');
      if (d === 'bottom')
        return (r.y + 'px');
    };

    $dom.css('top', renderY(rect, options.direction));
    $dom.css('left', renderX(rect, options.direction));
  };

  /**
   * [hideTooTips 操作页面属性隐藏一个元素]
   * @param  {[$Object]} $selector [一个页面元素]
   */
  function hideTooTips($selector) {
    var key = $selector.attr('tootip-key');
    $('div[tootip-key='+key+']').remove();
    $selector.data('isActivated', '');
  };


  /**
   * [eventListen 进行事件监听]
   * @param  {[$Object]} $selector [一个页面元素]
   * @param  {[String]} trigger [触发事件监听类型]
   */
  function eventListen($selector, _trigger, $context) {

    var trigger = (_trigger instanceof Array) ? _trigger : [_trigger];

    // click事件监听
    (trigger.includes('click')) &&  ($context || $selector).on('click', function () {
      if (!$selector.data('isActivated')) {
        showTootips($selector);
      }else {
        hideTooTips($selector);
      }
    });

    // 鼠标事件监听
    (trigger.includes('mouseover')) &&
       ($context || $selector).on('mouseout', function () {
         hideTooTips($selector);
       }).on('mouseover', function () {
         showTootips($selector);
    });
  }

  return {
    init: init,
    trigger: trigger,
    status: getStatus,
  }
})();