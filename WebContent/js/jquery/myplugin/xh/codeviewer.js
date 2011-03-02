(function($){
	function CodeViewer(pElem){
		this.parentElement = pElem;
		this._init();
	}
	
	CodeViewer.prototype._init = function(){
		$(this.parentElement).append('<input type="button" value="隐藏代码"  role="codeviewer"/><textarea rows="20" cols="150" wrap="off" style="overflow:hidden" role="codeviewer"></textarea><br/>');
		$(this.parentElement).find("input[role=codeviewer]").click(function(){
			var v = $(this).val();
			$(this).next().toggle();
			var visible = $(this).val()=="显示代码";
			$(this).val(visible?"隐藏代码":"显示代码");
		});
	}
	
	CodeViewer.prototype.showCode = function(code){
		code=code||"";
		if($.type(code) == "function"){
			this.showStr(code.toString());
		}else if(code.endsWith(".js")){
			var self = this;
			$.get(code, function(respData){
				self.showStr(respData);
			});
		}else{
			this.showStr(respData);
		}
	}
	
	CodeViewer.prototype.showStr = function(str){
		var t = $(this.parentElement).find("textarea[role=codeviewer]").last();
		t.val(str);
		t.css({width:t[0].scrollWidth+50, height:t[0].scrollHeight});
		
		t.prev().val("隐藏代码");
	}
	
	CodeViewer.createCodeViewer = function(elem){
		var d = $(elem).data("codeviewer");
		if(!d){
			d = new CodeViewer(elem);
			$(elem).data("codeviewer", d);
		}
		return d;
	}
	
	$.fn.codeViewer = function(){
		return this.each(function(i, elem){
			CodeViewer.createCodeViewer(elem);
		});
	}
	
	if(typeof(debug3)=="function"){debug3("Hi, I'm CodeViewer.js!It's just a test message for my loaded.");}
})(jQuery);