/* ========================================================================
 * Bootstrap: button.js v3.3.5
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  //注意区分 data-toggle=button 和 data-toggle=buttons 的区别
  var Button = function (element, options) {
    this.$element  = $(element)
    //定制 + 默认设置
    this.options   = $.extend({}, Button.DEFAULTS, options)
    //标记元素的状态是否处于isloading,即禁止交互状态， 用处不大，不使用此变量也可以，多一步DOM操作
    this.isLoading = false
  }

  Button.VERSION  = '3.3.5'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  //此功能只能使用JavaScript形式调用，应用对象 既可以应用在 button 也可以是 buttons
  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    // 1.<input>  2.<button>, <a>
    var val  = $el.is('input') ? 'val' : 'html'
    //data数据到底储存在哪
    var data = $el.data()

    //state形式的state会被转换为字符串
    state += 'Text'

    //设置重置文本
    //不能使用 if(!) 的形式， 特殊情况 空字符串会造成歧义
    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    // push to event loop to allow forms to submit
    // $.proxy作用等价于_.bind， 函数绑定, 修正setTimeout的全局this
    // 设置成异步，让业务逻辑先执行， 表现后执行
    setTimeout($.proxy(function () {
      // 修改元素的值
      // 此处的三目运算符的用于 判断模块的初始化方式， 根据结果返回相应的值
      // 此处也说明了在元素上设置状态文本时 data-"state"="XXX"的方式
      // 可改为 $el[val](data[state] || this.options[state])
      // 如果传入的state为对象 三目运算符会返回undefined，设置值得操作会转化为获取值得操作，从而不会造成异常
      $el[val](data[state] == null ? this.options[state] : data[state])

      // 修改元素的类
      // 不能同toggleClass 解决，因为还需要这是attr的值
      // 值为loading
      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      }
      // 值非loading， 去除禁用状态
      else if (this.isLoading) {
        this.isLoading = false
        //不需要 .addClass( "active" ), 设置状态的功能不需要对按钮中设置焦点
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    //默认是会触发change事件的
    var changed = true
    //查找buttons组件，data-toggle组件的最外层元素
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    // Checkbox / Radio toggle
    // 由于bootstrap使用lable优化按钮的样式， 所以input一些默认的功能会不起作用， 此部分的作用就是补充这些功能
    if ($parent.length) {
      //根据组件HTML和CSS，label包裹input,样式上覆盖input
      var $input = this.$element.find('input')
      // 单选按钮
      if ($input.prop('type') == 'radio') {
        //radio按钮于checkbook不同， 一旦被checked, 再次点击也不会取消checked
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      }
      // 复选按钮
      else if ($input.prop('type') == 'checkbox') {
        //进入函数前 checked和类不一致的情况时，操作只会使其一致，不会触发change事件
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      //利用类作标记设置prop值，checked值跟随类的状态
      $input.prop('checked', this.$element.hasClass('active'))
      //补充触发change事件的功能
      //通过DOM改变的value值，不会触发change事件
      if (changed) $input.trigger('change')
    }
    //single button
    else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  //当option为字符串的时候为调用具体的功能
  function Plugin(option) {
    //对于DOM集合的操作
    return this.each(function () {
      var $this   = $(this)
      //data也就是Button模块实例化的对象
      var data    = $this.data('bs.button')
      //判断是否对象并排除null的操作，值得学习
      //typeof返回的结果是字符串
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      //功能1：toggle
      if (option == 'toggle') data.toggle()
      //功能2：改变按钮状态
      //不判断直接传入， 会在函数内部会处理，类似于未调用的效果，但不是显示处理， 可读性不好
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
  //注意选择器的书写形式， 对button和buttons都应用监听
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      // 只要是.btn都可以应用single-toggle, 注意 buttons 用法中，.btn是应用在lable上的
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      //注意Plugin和Button的使用方式是不同的
      Plugin.call($btn, 'toggle')
      //注意 radio 和 checkbox 元素应用 preventDefaults时， 会影响checked特性
      if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) e.preventDefault()
    })
    // .代表命名空间 空格代表多个事件
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      //利用toggleClass第二个参数设置元素的类
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);
