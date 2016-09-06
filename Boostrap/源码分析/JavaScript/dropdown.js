/* ========================================================================
 * Bootstrap: dropdown.js v3.3.5
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================
  // 待看， 移动端使用的类
  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.5'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  //此功能不暴露给JavaScript调用方式
  //统一收回下拉列表
  function clearMenus(e) {
    // 3: 鼠标右键
    // 鼠标右键时不关闭列表
    if (e && e.which === 3) return
    $(backdrop).remove()
    //根据toggle查找dropdownmenu，也可以直接查找， 但是根据toggle可以服用 getParent()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      // 保存触发关闭的元素
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      // 如果单击的是内部输入元素则直接返回
      // 使用tagName判断就不用 使用jQuery的 is()了
      // 注意$.contains() 接受的参数都为单一DOM元素
      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      //relatedTarget为追加属性
      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))
      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  //思路：无论元素状态如何先收回下拉列表， 再根据状态判断是否弹出下拉列表
  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    //is接受的是一个选择器， 因此可以有逗号
    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      // ？？？待看，移动端的处理方式
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        // 没有单独设置active的样式，使用focus的样式
        .trigger('focus')
        // aria-*的作用就是描述这个tag在可视化的情境中的具体信息
        // ??? aria相关属性待整理
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  //思路： 先区分按键，再结合元素状态对不同按键应用不同的功能。 总体上注意排除特殊情况
  Dropdown.prototype.keydown = function (e) {
    //27: ESC, 38,40:上下方向键，32:空格键
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    //阻止冒泡，其他组件也可能对键盘设置监听事件
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      // 收回下拉列表但仍呈现获取焦点的样式
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down

    // ~ 按位非：-(X+1)
    // !~    25 -》 ！-26 —》 26
    // 如果 index 为负值， 则index置0。当未查找元素时， index 可能为负值 -1
    if (!~index)                                    index = 0

    // eq 类似 arr[ index ]
    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    //为什么 使用each 还使用return返回， 由于jQuery的链式语法， 最后会返回DOM集合
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    //只要有点击事件就先统一收回下拉列表
    .on('click.bs.dropdown.data-api', clearMenus)
    //下来列表和表单结合使用，防止与表单交互时收回下拉列表
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);
