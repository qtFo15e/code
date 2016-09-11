/**
 * Created by 77563 on 2016/8/15.
 */

$( function (  ) {

	//button.js
	$( document ).on( "click", "[data-toggle='buttons']", function ( e ) {
		var $ele = $( e.target )
		var $btnGroup =  $ele.parent( "[data-toggle='buttons']" )
		var $notele = $btnGroup.find( ".btn" ).not( $ele )
		$notele.toggleClass( "active" , !$ele.toggleClass( "active" ).hasClass( "active" ))
		$btnGroup.find( "input" ).prop( 'checked', $( this ).parent( "label" ).hasClass( "active" ) )
	} )


	//dropdown.js
	$( document ).on( "click", ".dropdown-toggle", function ( e ) {
		e.stopPropagation()
		$( e.target ).siblings( ".dropdown-menu" ).css( "display", "block" )
	} )

	$( document ).on( "click", function (  ) {
		$( ".dropdown-menu" ).css( "display", "none" )
	} )



	//modal.js
	$( document ).on( "click", '[data-toggle="modal"]', function ( e ) {
		var $btn = $( e.target )
		var $target = $( $btn.data( "target" ) )
		$target.addClass("modal-open").show()
		$target[0].offsetWidth
		$target.addClass( "in" )
		$( "<div class='modal-backdrop fade in'></div>" ).appendTo( "body" )

	} )
	$( document ).on( "click", '[data-dismiss="modal"]', function ( e ) {
		var $btn = $( e.target )
		var $target = $btn.closest( ".modal" )
		$target.one( "transitionend", function (  ) {
			$( this ).hide()
		} )
		$target.removeClass( "in" )
		$target[0].offsetWidth;
		$( ".modal-backdrop" ).remove()
	} )

	
	//carousel.js
	var $items = $( ".carousel-inner .item" )
	var $lis = $( ".carousel-indicators li" )
	var len = $items.length - 1
	var direction = "left"
	var index = 0
	var interval = 4000


	var autoShow = function (  ) {
		$items.each( function ( index, item ) {
			$( item ).removeClass( "fade in left right blur clear" )[0].offsetWidth
		} )
		$items.eq( index ).addClass( "fade" )[0].offsetWidth
		$( $items ).eq( index ).addClass( direction )
		if ( direction === "left" ) {
			index = index === len ? 0 : (index + 1)
		} else {
			index = index === 0 ? len : (index - 1)
		}
		$items.eq( index ).addClass( "in" )[0].offsetWidth
		$items.eq( index ).addClass( direction )
		$lis.removeClass( "active" ).eq( index ).addClass( "active" )
	}
	//重绘：js改变CSS会在js结束后重绘，重绘依照的样式就是最好累计的样式。需要分梯度修改样式就需要手动触发重绘
	var control =  setInterval(autoShow , interval )


	$( document ).on( "click.bs.carousel.data-api", ".carousel-control" ,function ( e ) {
		clearInterval( control )
		// 与源码接口不同
		direction = $( e.target ).closest( ".carousel-control" ).data( "slide" ) === "left" ? "right" : "left"
		autoShow()
		control = setInterval( autoShow, interval )
	} )

	$( document ).on( "click.bs.carousel.data-api", ".carousel-indicators li", function ( e ) {
		clearInterval( control )
		$items.each( function ( index, item ) {
			$( item ).removeClass( "fade in left right blur clear" )[0].offsetWidth
		} )
		$lis.removeClass( "active" )
		// 与源码接口不同
		index = parseInt( $( e.target ).data( "slide" ) )
		$items.eq( index ).addClass( "in blur" )[0].offsetWidth
		$items.eq( index ).addClass( "clear" )
		$lis.eq( index ).addClass( "active" )

		control = setInterval( autoShow , interval )
	} )
} )

