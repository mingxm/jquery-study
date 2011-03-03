/**
 * 文件上传插件
 * renderTo:需要渲染到的dom节点
 * width：该控件的宽度
 * img：按钮的背景图片，还需要调试
 * mutilFile：是否可以多选，暂未实现
 */
 
 (function($){
 	$.extend($.fn,{
 		jUploadFile:function(setting){
 			var config = $.extend({
 				renderTo:$(document.body),
 				width:100,
 				img:'url(image/pic.gif)',
 				mutilFile:false
 			},setting);
 			
 			var obj = $('<div></div>').addClass("upload-wrap").appendTo(config.renderTo).css("width",config.width);
 			var t = $('<input type="text"/>').addClass("upload-text").appendTo(obj).css("width",config.width-30);
 			var f = $('<input type="file"/>').addClass("upload-file").appendTo(obj);
 			var b = $('<input type="button">').addClass("upload-btn").appendTo(obj);
 			f.bind("change",function(){
 				t.attr("value",f.attr("value"));
 			})
 			
 		}
 	});
 })(jQuery);