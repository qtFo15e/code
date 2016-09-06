/* ========================================================================
 * Bootstrap: transition.js v3.3.5
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  //判断浏览器对CSS transition的支持情况
  function transitionEnd() {
    var el = document.createElement('bootstrap')

    // 键：DOM中CSS属性transition的属性名
    // 值：DOM中transition结束时触发的事件名
    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        //根据本浏览器的支持性，选择相应的属性名
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  // 模拟触发过渡结束事件
  // 使用模拟触发过渡结束事件的原因：浏览器对过渡结束事件支持性不好，即过渡结束后不触发事件 （具体见博客）
  $.fn.emulateTransitionEnd = function (duration) {
    // called = false 表示动画结束事件未被调用
    var called = false
    var $el = this
    //如果触发了过渡结束事件，就不需再模拟过渡结束了
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () {
      //触发过渡结束事件
      if (!called) $($el).trigger($.support.transition.end)
    }
    setTimeout(callback, duration)
    //保持连缀
    return this
  }

  //不使用匿名函数自执行的原因是，等文档的结构初步确定后，再开始测试支持性
  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    //添加自定义事件
    $.event.special.bsTransitionEnd = {
      //事件类型
      bindType: $.support.transition.end,
      //委托类型
      delegateType: $.support.transition.end,
      //事件回调函数
      handle: function (e) {
        //如果目元素触发自身的监听事件，则 调用事件处理函数
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);
