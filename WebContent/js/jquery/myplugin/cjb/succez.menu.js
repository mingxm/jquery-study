/**
 * menu - Succez Menu Component
 * 
 * @author chenpw@gmail.com
 * 
 * @param{obj} container 菜单容器，该参数是必需的
 * @param{obj} options 菜单配置选项，可选。例如：{left:100, top:100}
 * 
 * @example
 * $("#test").succezMenu("popupDown", $("#btn"));
 * @example
 * $("#test").succezMenu("popup", {pageX:100,pageY:200});
 * @example
 * $("a").click(function(e){
 * 	$("#test").menu("popupDown", e);
 * });
 * @example
 * $(document).bind("contextmenu", function(e){
 * 	$("#test").succezMenu("popup", e);
 * });
 */
(function($) {
	// 可能会存在其它的菜单组件也叫menu，这里通过创建succez命名空间来避免出现问题
	$.succez = $.succez || {};

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
	 * @param{obj} p 菜单容器
	 * @param{obj} slf 当前菜单项
	 * @private
	 */
	function _eachBindMenuItemEvent(p, slf) {
		// li
		var rs = $(slf).parent();
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
					    left	: rs.outerWidth() - 6,// TODO:临界处理
					    // 子菜单的顶轴显示向相对于菜单项的上面调整一些，这样显示出来的子菜单效果也会好些
					    top		: subm.position().top - 24
				    });
				$.extend($.data(p, "succez-menu"), {
					    current	: subm
				    });
			}
			  // TODO
		  }, function() {
			  rs.css("background-color", "");
			  var subm = rs.children().children("ul");
			  var smdata = $.data(p, "succez-menu");
			  if (smdata.current != subm) {
				  subm.hide();
				  var top = $.data(subm[0], "pos.top");
				  if (top) {
					  subm.css("top", top);
				  }
			  }
			  // TODO
		  });
	};

	// 浮动菜单组件
	$.succez.menu = function(container, options) {
		this.options = options = $.extend({}, $.succez.menu.defaults, options);
		this.container = container;
		var p = $(container);
		p.addClass("succez-menu");
		// 找到菜单组件中所有的子菜单项
		var allsubmenus = p.find("ul");
		allsubmenus.addClass("succez-menu sub");
		// 为子菜单项与菜单组件设置外观
		var allmenus = allsubmenus.andSelf();
		allmenus.hide();

		var items = p.find("li");
		items.wrapInner("<div/>");
		items.filter(_filterSplitItems).empty().addClass("split");
		p.find("li>div").each(function() {
			    _eachBindMenuItemEvent(container, this);
		    });
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
	 * 缺省配置
	 * @private
	 */
	$.succez.menu.defaults = {
		zIndex	: 99999,
		left		: 0,
		top		 : 0
	};

	$.succez.menu.prototype = {
		/**
		 * 将浮动菜单显示在指定的位置
		 * @param{obj} e Event对象
		 * @example
		 * $("#test").succezMenu("popup", {pageX:100,pageY:200});
		 * @example
		 * $(document).bind("contextmenu", function(e){
		 *   $("#test").succezMenu("popup", e);
		 * });
		 */
		popup		  : function(e) {
			$("ul[active=active]").hide();
			var rs = e || {};
			var slf = $(this.container);

			if (!$.isEmptyObject(rs)) {
				document.title = rs.pageX + slf.outerWidth()
				slf.css({
					    left	: rs.pageX,
					    top		: rs.pageY
				    });
			}
			slf.show();
			slf.attr("active", "active");
		},
		/**
		 * 将浮动菜单显示在元素的下面
		 * @param{obj} e Event对象
		 * @example
		 * $("#test").succezMenu("popupDown", $("#test2"));
		 * @example
		 * $("a").click(function(e){
		 *   $("#test").succezMenu("popupDown", e);
		 * });
		 */
		popupDown	: function(e) {
			var rs = e || {};
			if ($.isEmptyObject(rs))
				return;

			var target = $.isEmptyObject(rs.target) ? rs : $(rs.target);
			this.popup({
				    pageX	: target.offset().left,
				    pageY	: target.offset().top + target.outerHeight()
			    });
		}
	};

	/**
	 * @param{str,obj} options
	 * @example
	 * $("#test").succezMenu("popupDown", $("#btn"));
	 * @example
	 * $("#test").succezMenu("popup", {pageX:100,pageY:200});
	 * @example
	 * $("a").click(function(e){
	 * 	$("#test").menu("popupDown", e);
	 * });
	 * @example
	 * $(document).bind("contextmenu", function(e){
	 * 	$("#test").succezMenu("popup", e);
	 * });
	 */
	$.fn.succezMenu = function(options) {
		var args = Array.prototype.slice.call(arguments, 1);
		return this.each(function() {
			    if (typeof(options) == "string") {
				    /**
				     * 用来执行菜单组件中定义的方法，
				     * 例如：
				     * 要显示在指定的位置
				     * $("#test").succezMenu("popup", {pageX:100,pageY:100});
				     */
				    var rs = $.data(this, "succez-menu");
				    if (rs) {
					    // $.succez.menu
					    rs[options].apply(rs, args);
				    }
			    }
			    else if (!$(this).is(".succez-menu")) {
				    $.data(this, "succez-menu", new $.succez.menu(this, options));
			    }
		    });
	};

	/**
	 * 将所有指定了data-role='menu'属性的UL元素初始为浮动菜单组件
	 * @private
	 */
	$(function() {
		    $("ul[data-role='menu']").succezMenu();
	    });

})(jQuery);
