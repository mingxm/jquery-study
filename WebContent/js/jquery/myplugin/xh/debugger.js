(function($){
	function Debugger(pElem){
		this.parentElement = pElem;
		this._init();
	}
	
	Debugger.prototype._init = function(){
		$(this.parentElement).append("<textarea rows=10 cols=100 role=\"debug\">==debugger console==</textarea>");
	}
	
	Debugger.prototype.debug = function(msg, notPrintln){
		var textarea = $(this.parentElement).find("textarea[role=debug]")[0];
		if(notPrintln){
			textarea.value = textarea.value+msg;
		}else{
			textarea.value = textarea.value+"\r\n"+msg;
		}
	}
	
	Debugger.prototype.show = function(){
		$(this.parentElement).find("textarea[role=debug]").show();
	}
	
	Debugger.prototype.hide = function(){
		$(this.parentElement).find("textarea[role=debug]").hide();
	}
	
	Debugger.createDebugger = function(elem){
		var d = $(elem).data("debugger");
		if(!d){
			d = new Debugger(elem);
			$(elem).data("debugger", d);
		}
		return d;
	}
	
	$.fn.debuger = function(){
		return this.each(function(i, elem){
			Debugger.createDebugger(elem);
		});
	}
	
	if(typeof(debug3)=="function"){debug3("Hi, I'm debugger.js!It's just a test message for my loaded.");}
})(jQuery);