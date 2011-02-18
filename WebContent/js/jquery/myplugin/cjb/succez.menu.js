/**
 * menu - Succez Menu Component
 * 
 * @author chenpw@gmail.com
 * 
 * @param{str} options 菜单配置选项，例如：{left:100, top:100}
 * 
 * @example $("#test").menu();
 * @example $("#test").menu({left:100,top:10}).show();
 * @example $("#test").menu().hide();
 * @example
 * $("a").click(function(e){$("#test").menu().popupDown(e);));
 * @example
 * $(document).bind("contextmenu", function(e){$("#test").menu().popup(e);});
 */
(function($) {
	/**
	 * @param{dom} p
	 * @private
	 */
	function _init(p) {
		// 找到菜单组件中所有的子菜单项
		var allsubmenus = $(p).find("ul");
		// 为子菜单项与菜单组件设置外观
		var allmenus = allsubmenus.andSelf();
		allmenus.addClass("succez_menu").hide();

		var items = $(p).find("li");
		items.wrapInner("<div/>");
		items.filter(_filterSplitItems).empty().addClass("split");
		$(p).find("li>div").each(_eachBindMenuItemEvent);
		$("li:has('ul')").each(function() {
			$(this).addClass("arrow");
			  // $(this).find("ul").each(function(){
			  // $(this).insertAfter(p);
			  // });
			  // TODO
		  });

		// 绑定页面的点击事件，使菜单组件在点击到组件外时能够隐藏起来
		$(document).bind("click", function() {
			allmenus.hide();
			  // TODO
		  });
		// TODO
	};

	/**
	 * 过滤出分割栏的菜单项，分割栏以“--”标识
	 * @example
	 * <li>New</li>
	 * <li>--</li>
	 * <li>Close</li>
	 * @private
	 */
	function _filterSplitItems() {
		return $(this).text().match(/^--$/);
	};

	/**
	 * 为菜单项进行事件的绑定
	 * @private
	 */
	function _eachBindMenuItemEvent() {
		// li
		var rs = $(this).parent();
		rs.hover(function(e) {
			rs.css("background-color", "#C7DFFC");

			var subm = rs.children().children("ul");
			if (subm.is(":hidden")) {
				subm.show();
				// var left = rs.offset().left + rs.outerWidth() - 2;
				// if (left + subm.outerWidth() > $(window).width()) {
				// left = rs.offset().left - subm.outerWidth() + 2;
				// }
				// var top = rs.offset().top - 3;
				$.data(subm[0], "pos.top", subm.position().top);
				subm.css({
					    left	: subm.outerWidth() - 6,// TODO:临界处理
					    top		: subm.position().top - 16
				    });
				$.extend($.fn.menu.options, {
					    current	: subm
				    });
			}
			  // TODO
		  }, function() {
			  rs.css("background-color", "");
			  var subm = rs.children().children("ul");
			  if ($.fn.menu.options.current != subm) {
				  subm.hide();
				  var top = $.data(subm[0], "pos.top");
				  if (top) {
					  subm.css("top", top);
				  }
			  }
			  // TODO
		  });
	};

	$.fn.menu = function(options) {
		options = options || {};

		return this.each(function() {
			    // 这里的this是组件最外层的DOM对象
			    var rs = $.data(this, "menu");
			    if (rs) {
				    // 如果此附加数据是已经绑定好了的，就将用户指定的options参数设置到附加数据中
				    $.extend(rs.options, options);
			    }
			    else {
				    // 如没有附加数据则需要将用户指定的options参数与组件默认的参数合在一起绑定到组件上
				    rs = $.data(this, "menu", {
					        options	: $.extend({}, $.fn.menu.options, options)
				        });
				    _init(this);
			    }

			    $(this).css({
				        left	: rs.options.left,
				        top		: rs.options.top
			        });
		    });
	};

	/**
	 * @private
	 */
	$.fn.menu.options = {
		zIndex	: 99999,
		left		: 100,
		top		 : 100
	};

	/**
	 * 将浮动菜单显示在元素的下面
	 * @param{obj} e Event对象
	 * @example
	 * $("a").click(function(e){$("#test").menu().popupDown(e);));
	 */
	$.fn.popupDown = function(e) {
		$("ul[active=active]").hide();
		var rs = e || {};
		if (!$.isEmptyObject(rs)) {
			var target = $(rs.target);
			this.css({
				    left	: target.offset().left,
				    top		: target.offset().top + target.outerHeight()
			    });
		}
		this.attr("active", "active");
		this.show();
	};

	/**
	 * 将浮动菜单显示在指定的位置
	 * @param{obj} e Event对象
	 * @example
	 * $("#test").menu().popup({pageX:100,pageY:200});
	 * @example
	 * $(document).bind("contextmenu", function(e){$("#test").menu().popup(e);});
	 */
	$.fn.popup = function(e) {
		$("ul[active=active]").hide();
		var rs = e || {};
		if (!$.isEmptyObject(rs)) {
			this.css({
				    left	: rs.pageX,
				    top		: rs.pageY
			    });
		}
		this.attr("active", "active");
		this.show();
	};

	/**
	 * 将所有指定了data-role='menu'属性的UL元素初始为浮动菜单组件
	 * @private
	 */
	$(function() {
		    $("ul[data-role='menu']").menu();
	    });

})(jQuery);
