/* ========================================================================
 * Bootstrap: carousel.js v3.3.5
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    //??? 移动端，待研究
    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      // 使用函数绑定， 触发事件的元素是图片元素，不是顶层元素
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.5'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    //？？？ 为什么不阻止冒泡呢
    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    // 清除之前的简写调用
    this.interval && clearInterval(this.interval)

    //前提条件：1.设置了间隔值  2.未暂停
    this.options.interval
      && !this.paused
      // setInterval为全局函数
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  //？？？测试
  //为什么不使用闭包解决：每个实例拥有相同的函数，但都各自占据内存
  Carousel.prototype.getItemIndex = function (item) {
    //不能用 this.$items = item.sibling('.item')
    // 需要求自生元素集的长度 + sibing的长度
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  //
  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    // 循环链表，循环是判断条件
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    //例如，累加和为4时， 3 % 3 = 0 ， index为 0
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    //事件排队
    //使用that防止this被劫持
    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    // 当前图片与选中图片一致时
    if (activeIndex == pos) return this.pause().cycle()


    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {

    // 利用逻辑运算符代替
    //  a || b =》 if ( !a ) { b }
    //  a && b =》 if ( a ) { b }

    e || (this.paused = true)

    // .active图片会被遮蔽，可以忽略对它的操作
    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      //??? 没什么卵用，可以去掉
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    // 由于使用的是CSS动画， 不能中断
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    //变量名起到注释的作用
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    //中断默认的循环轮播
    isCycling && this.pause()

    //使指示器与轮播图片保持一致
    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    // .slide 没用具体样式，只是为JavaScript程序提供hook
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      //利用此行代码在附加过渡属性前， 强制重绘，否则过渡属性不起作用
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          //??? 不清楚为什么用异步
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    //开启默认的循环轮播
    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  // UI操作传入的option一定是对象

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      //!!!当第四个参数返回false时， extend接受false参数不会抛错，但会忽略此处的功能
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      //以下的几句根据变量的引用顺序， 先后可调整， 便于理解
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))

      if (typeof option == 'number') data.to(option)

      else if (action) data[action]()

      // 通常情况下的默认操作 初始化开始轮播循环
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return

    //???为什么要重复追加 .carousel上的数据呢
    var options = $.extend({}, $target.data(), $this.data())

    // 此处写法比较混乱
    //Plugin 承担了 prev, next的功能
    //此处承担 slideIndex 的功能
    // !!!???待改进 功能归到Plugin下， 此处指配置参数

    var slideIndex = $this.attr('data-slide-to')
    //取消自动播放
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  // 使用 window load 的原因
  // 由于是轮播组件， 初始化前先等待图片加载完成， 这也正是 load 和 ready 的差异所在
  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);
