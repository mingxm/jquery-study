(function($){
	function CodeRunner(pElem){
		this.parentElement = pElem;
		this._init();
	}
	
	CodeRunner.prototype._init = function(){
		$(this.parentElement).append("<div><input type=\"button\" value=\"run\" role=\"coderunner\"/><br/><textarea rows=\"10\" cols=\"100\" role=\"coderunner\">//insert code here, and press run button</textarea></div>");
		
		var self = this;
		$(this.parentElement).find("input[role=coderunner]").click(function(){
			self.run();
		});
	}
	
	CodeRunner.prototype.run = function(){
		eval( $(this.parentElement).find("textarea[role=coderunner]").val() );
	}
	
	CodeRunner.prototype.writeln = function(value){
		var textarea = $(this.parentElement).find("textarea[role=coderunner]");
		textarea.val(textarea.val()+"\r\n"+value);
	}
	
	CodeRunner.prototype.show = function(){
		$(this.parentElement).find("textarea[role=coderunner]").parent().show();
	}
	
	CodeRunner.prototype.hide = function(){
		$(this.parentElement).find("textarea[role=coderunner]").parent().hide();
	}
	
	CodeRunner.create = function(elem){
		var d = $(elem).data("coderunner");
		if(!d){
			d = new CodeRunner(elem);
			$(elem).data("coderunner", d);
		}
		return d;
	}
	
	$.fn.codeRunner = function(){
		return this.each(function(i, elem){
			CodeRunner.create(elem);
		});
	}
	if(typeof(debug3)=="function"){debug3("Hi, I'm coderunner.js!It's just a test message for my loaded.");}
})(jQuery);