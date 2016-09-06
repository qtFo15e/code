/* ========================================================================
 * Bootstrap: alert.js v3.3.5
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  //（关闭按钮）CSS属性选择器,
  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    //JavaScript式调用方法将事件委托在el上，而不是document原因:
    // js形式的声明只对本元素产生作用，元素的存在或不存在是于功能保持一致的。
    // 用document的原因是把功能放在高层，统一声明一次，之后添加或去除部分元素都功能都不变
    //注意new 过程中的步骤顺序
    $(el).on('click', dismiss, this.close)
  }

  //版本号作为构造函数的属性
  Alert.VERSION = '3.3.5'

  //规范：常量大写
  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    //目标对象 = $(data-target || href).length || .closest( ".alert" )

    //使用 .data()也可以
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      // 利用逻辑运算符的顺序性，替代条件语句
      //使用零宽断言匹配片段，消去片段前的部分
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    //检查e存在性的原因：JavaScript式的调用方式是不传入事件对象的
    //组织事件触发的默认行为 如<a>的跳转， 表单的提交等
    if (e) e.preventDefault()

    //前两种方法均为明确指定目标元素
    //选择器未匹配到元素的情况下， 查找最近的.alert元素
    if (!$parent.length) {
      //性能最不好的方法
      $parent = $this.closest('.alert')
    }

    // trigger可以接受一个事件对象作为参数
    // 给用户提供调用过渡调用前的事件接口
    // 生成一个事件对象，延长生命周期作为hook
    $parent.trigger(e = $.Event('close.bs.alert'))

    // 注意此时的e已经是新创建的事件对象了
    // 如果 close.bs.alert 事件的处理函数阻止的默认操作则返回函数
    // prevenDefautls 功能不会阻止下一个事件处理函数，只会阻止浏览器的默认行为。但是此处的用法默认规定可以阻止后续的事件处理函数
    if (e.isDefaultPrevented()) return

    // 改变CSS属性
    // 触发CSS的过渡效果
    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      // UI移除后触发 alert完成事件 ，再真正移除
      // 不先触发再remove的原因，为用户提供更多的调用接口
      // 此处就不需要使用事件对象了，其他地方不需要hook
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        //如果duration内过渡属性未触发完成事件，则手动触发结束
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================
  // 提供JavaScript的方法赋予alert的功能，并且alert对象储存在元素上
  // 将alert对象储存在元素的原因：
  // 多个元素共用一个实例对象的弊端是，无法针对单个元素设置一些独特的属性（在复杂的组件中体现的更明显）
  //（由于闭包，构造函数的生命周期没有问题）
  // 可根据参数直接调用alert的功能
  function Plugin(option) {
    //this 执行的是jQuery的DOM集合
    return this.each(function () {
      var $this = $(this)
      //一个简单的单例模式，避免重复建立对象
      //将对象附加到元素上的原因,
      //由于需要根据参数执行对象上的方法，所以要创建alert对象，两种方法
      //1.元素内的单例模式：每个元素仅需要一个单例对象，alert对象是与元素一一对应的，所以将对象保持在元素上
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  //暴露JavaScript接口
  var old = $.fn.alert

  $.fn.alert             = Plugin
  //暴露构造函数
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================
  // 归还alert的原持有者
  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============
  // 元素的data-api用法
  // 监听事件委托到document上,隐含也决定了元素的事件顺序，由于冒泡机制委托的事件处理程序会在最后之执行
  // 定义了多个命名空间，提供更多元化的off操作
  // 猜测层级：1.bs: bootstrap 2.alert: alert模块 3.data-api: bootstrap及其插件
  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);
