(function($){
	$.succezBI = $.succezBI || {};
	$.succezBI.getDomHtmlByTag = function(tag){
		if(typeof tag === "string"){
			switch(tag){
			case "button":
				return "<input type='button' style='height:25px;width:30px;'/>";
			case "label":
				return "<p>表头</p>";
			case "edit":
				return "<input type='edit'/>";
			}
		}
		return "";
	};
})(jQuery);