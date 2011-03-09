/**
 * 可以这样使用contextpath：
 * 1、$.sys.getContextPath(callback)
 */

$.sys  = {
	getContextPath : function(callback){
		$.ajax({url:"/contextpath.html",
			success:function(){
				callback("/"); //contextpath是空
			},
			error:function(){
				var contextpath = window.location.pathname.split("/")[1];
				callback(contextpath);
			}
		});
	},
	
	scrollToBottom : function(){
		//让页面自动滚动到底部(@see http://zww.me/archives/25144)
		$body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');// 这行是 Opera 的补丁, 少了它 Opera 是直接用跳的而且画面闪烁 by willin
		$body.animate({scrollTop: document.body.scrollHeight}, 100);
	}
}

$.cptester = $.contextPathTester = {
	setImageSrc1 : function(imgElem){
		$(imgElem).attr("src", "Tulips.jpg");
	},
	
	setImageSrc2 : function(imgElem){
		$(imgElem).attr("src", "../../js/jquery/myplugin/xh/Tulips.jpg");
	},
	
	setImageSrc3 : function(imgElem){
		$(imgElem).attr("src", "Desert.jpg");
	}
}

//让每个页面自动滚动到底部
$(function(){
	if($("body").attr("autoScrollToBottom")){
		$.sys.scrollToBottom();
	}
}); 