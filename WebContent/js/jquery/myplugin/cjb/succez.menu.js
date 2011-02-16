/**
 * menu - Succez Menu Component
 * 
 * @author chenpw@gmail.com
 * 
 * @param{str} options 选项开关，show或者hide，缺省为show
 * @param{obj} params 菜单的显示坐标，例如：{left:100, top:100}
 * 
 * @example $("ul[data-role='menu']").menu();
 * @example $("ul[data-role='menu']").menu("show");
 * @example $("ul[data-role='menu']").menu("show", {left:100,top:10});
 */
(function($) {

	/**
	 * @param{dom} p
	 */
	function _init(p) {
		$(p).addClass("succez_menu");
		$(p).find("ul").hide();
		$(p).find("li:contains('--')").addClass("split");
		// TODO
	};

	$.fn.menu = function(options, params) {
		options = options || {};
		if (typeof(options) == "string") {
			if (options == "show") {
				// TODO
			}
			if (options == "hide") {
				// TODO
			}
		}

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
					        options	: $.extend({}, $.fn.menu.defaults.options, options)
				        });
				    _init(this);
			    }
			    $(this).css({
				        left	: rs.options.left,
				        top		: rs.options.top
			        });
		    });
	};

	$.fn.menu.defaults = {
		options	: {
			zIndex	: 99999,
			left		: 100,
			top			: 100
		}
	};

})(jQuery);
