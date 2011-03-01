(function($){

$.loadJs=function(jsfile, callback){//加载单个js
	$.getScript(jsfile, callback); 
};


$.loadJsMulti = function(jsfiles, callback){//加载单个js
	if(!jsfiles) return callback();
	var array = jsfiles.split(",");
	
	var jsstatus = [];
	function do_complete(){
		jsstatus[this.index] = true;
		for(var i = 0;i < array.length; i++){
			if(!jsstatus[i]) return;
		}
		
		//所有的js都加载完毕，调用回调函数
		callback();
	}
	
	for(var i = 0;i < array.length; i++){
		$.ajax({ url:array[i]
			,context:{index:i, js:array[i]}
			,complete:do_complete
			,dataType:"script"
		});
	}
};

/**
 * 异步载入一个或多个js文件，载入完毕时调用callback方法。当有多个js时，用逗号或者分号隔开。当载入过程中发生异常时，会抛出异常，callback不会执行。
 * 有2类异常，一是网络异常，比如js文件不存在；二是js内容执行异常。对于前一种异常可以很好地处理，后一种异常只能在window.onerror中截获到，不好处理，暂未处理第二种异常。 TODO
 * eg:
 * 1、$.include("1.js,2.js,3.js",function(){ ... });
 * 	  $.include("1.js;2.js;3.js",function(){ ... });
 */
$.include = function(jsfiles, callback){
	if(!jsfiles){
		debug3("要加载的js文件是空，不需加载。");
		return callback&&callback();
	}
	if(jsfiles.indexOf(",")>0) jsfiles = jsfiles.split(",");
	else jsfiles = jsfiles.split(";");
	jsfiles = $.map(jsfiles, function(jsfile){return jsfile.trim();});

	var jsloader = $(document).data("_jsloader");
	if(jsloader){
		var ret;
		for(var i = 0;i < jsfiles.length; i++){
			var jsfile = jsfiles[i];
			if(!jsloader.jsloaded[jsfile]){ //加载过，成功了
				ret=ret||[];
				ret[ret.length++]=jsfile;
			}
		}
		if(!ret){
			debug3("要加载的js文件已经全部加载，不需再加载。");
			return callback&&callback(); //全部已经加载过了
		}
		
		if(jsfiles.length>ret.length){
			debug3("要加载的js文件有些已经加载，需要加载的是："+jsfiles.join(","));
		}
		
		jsfiles = ret;
	}

	var oneLoadConfig = {
		time:$.now()
		,jsfiles:jsfiles
		,callback:callback
		,completed:false
		,checkComplete:function(jsloader){debugger;
			if(this.completed){
				debug3("\tjs已经全部加载完毕（按道理不应该执行到这里，可能的原因是在调用include方法时，参数js中有重复的js，比如include('1.js,1.js')）");
				return;
			}
			
			debug3("\t开始检查本次include的js是否全部载入完毕...");
			var errors=0;
			var success=0;
			var errorLst=[];
			for(var i = 0;i < this.jsfiles.length; i++){
				if(jsloader.jsloaded[this.jsfiles[i]]){
					debug3("\t\t"+this.jsfiles[i]+"载入成功");
					success++;
				}else if(jsloader.jserror[this.jsfiles[i]]){
					debug3("\t\t"+this.jsfiles[i]+"载入失败");
					errorLst = errorLst||[];
					errorLst[errors] = jsloader.jserror[this.jsfiles[i]];
					errors++;
				}else if(jsloader.jsloading[this.jsfiles[i]]){
					debug3("\t\t"+this.jsfiles[i]+"正在载入");
				}else{
					debug3("\t\t"+this.jsfiles[i]+"的状态未知。应该是有错误发生！！");
				}
			}
			
			if(success+errors == this.jsfiles.length){
				debug3("\t检查结果：全部载入完毕，其中有"+errors+"个载入失败，有"+success+"个载入成功");
				//全部加载完毕
				this.completed=true;
				if(errors>0){
					//部分加载出现错误
					var msg = "js载入发生异常：";
					for(var i = 0;i < errors; i++){
						msg+=(i+1)+"、"+errorLst[i].status+" "+errorLst[i].errorMsg+"（"+errorLst[i].js+"）；";
					}
					throw new Error(msg);
				}else{
					//全部加载成功
					return this.callback&&this.callback();
				}
			}else{
				debug3("\t检查结果：尚未载入完毕，其中有"+errors+"个载入失败，有"+success+"个载入成功，"+"有"+(this.jsfiles.length-errors-success)+"个尚未载入");
			}
		}
	};
	
	if(!jsloader){
		jsloader={
			jsloading:{} //jsloading["my.js"]=[config1,config2]，表示my.js正在加载，config1和config2在等待它加载
			,jsloaded:{} //jsloaded["my.js"]=true，表示my.js已经成功加载完毕
			,jserror:{} //jserror["my.js"]={status:status, errorMsg:errorMsg}，表示my.js加载失败了，失败信息是其值
			,addOneConfig:function(config){
				var jsfiles=config["jsfiles"];
				var loadedNum=0;
				debug3("检查各个js的状态：");
				for(var i = 0;i < jsfiles.length; i++){
					var jsfile = jsfiles[i];
					
					if(this.jsloading[jsfile]){ //正在加载中，只需要将config加入到正在加载的config队列中
						debug3("\t"+jsfile+"的状态：正在加载中，是其它人include的。");
						this.jsloading[jsfile][this.jsloading[jsfile].length++]=config;
					}else if(this.jserror[jsfile]){ //加载过，但是失败了，再次加载它
						debug3("\t"+jsfile+"的状态：已经加载过了，是其它人include的，但是失败了。再次加载它。");
						this.jserror[jsfile] = undefined;
						this.jsloading[jsfile] = this.jsloading[jsfile]||[];
						this.jsloading[jsfile][this.jsloading[jsfile].length++]=config;
						
						this.load(jsfile);
					}else if(this.jsloaded[jsfile]){ //加载过，成功了
						debug3("\t"+jsfile+"的状态：已经加载过了，是其它人include的。已经成功加载，不需要再次加载。");
						loadedNum++;
					}else{ //从未加载过
						debug3("\t"+jsfile+"的状态：没有被加载过，需要加载。");
						this.jsloading[jsfile] = [];
						this.jsloading[jsfile][this.jsloading[jsfile].length++]=config;
						
						this.load(jsfile);
					}
				}
				
				if(loadedNum == jsfiles.length){
					config.callback();
				}
			} 
			,load:function(jsfile){
				debug3("$.ajax载入"+jsfile+"中...");
				$.ajax({ url:jsfile
					,context:{js:jsfile, _self:this}
					,success:this.do_success
					,error:this.do_error
					,dataType:"script"
					,converts:{"text script":function(text){
						$(document).data("_jsloader").setExecing();
						jQuery.globalEval( text );
						return text;
					}}
				});
			}
			,do_success:function(){
				var jsloader = this._self;
				if(this.isExecFailed()){
					jsloader.do_execError.apply(this, jsloader.execErrorMsg);
					return;
				}
				
				debug3("...$.ajax返回成功信息："+this.js+"");
				jsloader.jsloaded[this.js]=true;
				
				var configWaiting = jsloader.jsloading[this.js];
				jsloader.jsloading[this.js]=undefined;
				for(var i = 0;i < configWaiting.length; i++){
					configWaiting[i].checkComplete(jsloader);
				}
				
			}
			,do_error:function(jXHR, status, errorMsg){
				debug3("...$.ajax返回失败信息："+status+" "+errorMsg+"（"+this.js+"）");
				var jsloader = this._self;
				jsloader.jserror[this.js]={status:status, errorMsg:errorMsg, js:this.js};
				
				var configWaiting = jsloader.jsloading[this.js];
				jsloader.jsloading[this.js]=undefined;
				for(var i = 0;i < configWaiting.length; i++){
					configWaiting[i].checkComplete(jsloader);
				}
			}
			,do_execError:function(errorMsg){
				debug3("...$.ajax返回成功信息，但是脚本执行失败："+errorMsg+"（"+this.js+"）");
				var jsloader = this._self;
				jsloader.jserror[this.js]={status:status, errorMsg:errorMsg, js:this.js};
				
				var configWaiting = jsloader.jsloading[this.js];
				jsloader.jsloading[this.js]=undefined;
				for(var i = 0;i < configWaiting.length; i++){
					configWaiting[i].checkComplete(jsloader);
				}
			}
			,setExecStatus:function(status){ //正常的状态变化流程是execing-execComplete，如果执行过程中有错误发生，则流程是execing-execFail
				this.execStatus = status;
			}
			,setExecFailed:function(errorMsg){ //从服务器端加载脚本之后会执行它，执行时可能出现js错误。这个js错误可以在window.onerror中截获，截获之后调用本方法通知loader。
				this.execStatus = "failed";
				this.execErrorMsg = errorMsg;
			}
			,setExecing:function(){ //从服务器端加载脚本之后会执行它，执行时可能出现js错误。这个js错误可以在window.onerror中截获，截获之后调用本方法通知loader。
				this.execStatus = "execing";
			}
			,isExecFailed:function(){ //从服务器端加载脚本之后会执行它，执行时可能出现js错误。这个js错误可以在window.onerror中截获，截获之后调用本方法通知loader。
				return this.execStatus = "failed";
			}
			,isExecing:function(){ //从服务器端加载脚本之后会执行它，执行时可能出现js错误。这个js错误可以在window.onerror中截获，截获之后调用本方法通知loader。
				return this.execStatus = "execing";
			}
		};
		
		$(document).data("_jsloader", jsloader);
	}
	
	jsloader.addOneConfig(oneLoadConfig);
}

$.nowstr = function(templet) {
	var date=new Date();
	var year, month, day, hour, minutes, seconds, short_year, full_month, full_day, full_hour, full_minutes, full_seconds;
	if (!templet)
		templet = "hh:ii:ss,ms";
	year = date.getFullYear().toString();
	if (year.length < 4) {// 处理年份小于1000的情况
		if (year.length == 0)
			year = "0000";
		else if (year.length == 1)
			year = "000" + year;
		else if (year.length == 2)
			year = "00" + year;
		else if (year.length == 3)
			year = "0" + year;
	}
	// if (year.length > 4) year = year.substring(0, 4);
	short_year = year.substring(2, 4);
	month = (date.getMonth() + 1);
	full_month = month < 10 ? "0" + month : month;
	day = date.getDate();
	full_day = day < 10 ? "0" + day : day;
	hour = date.getHours();
	full_hour = hour < 10 ? "0" + hour : hour;
	minutes = date.getMinutes();
	full_minutes = minutes < 10 ? "0" + minutes : minutes;
	seconds = date.getSeconds();
	full_seconds = seconds < 10 ? "0" + seconds : seconds;
	
	return templet.replace("yyyy", year).replace("mm", full_month).replace(
			"dd", full_day).replace("yy", short_year).replace("m", month)
			.replace("d", day).replace("hh", full_hour).replace("ii",
					full_minutes).replace("ss", full_seconds).replace("h",
					hour).replace("i", minutes).replace("s", seconds);
}



//String
String.prototype.equalsIgnoreCase = function(str) {
  str = str==null?"":str;
  return this.toUpperCase() === str.toUpperCase();
}

String.prototype.compareTo = function(str) {
  var s1 = this.toString();
  var s2 = str.toString();
  if (s1 === s2) return 0;
  else if (s1 > s2) return 1;
  else return -1;
}

String.prototype.compareToIgnoreCase = function(str) {
  var s1 = this.toUpperCase();
  var s2 = str.toUpperCase();
  if (s1 === s2) return 0;
  else if (s1 > s2) return 1;
  else return -1;
}


String.prototype.startsWith = function(prefix) {
  return this.substring(0, prefix.length) == prefix;
}

String.prototype.endsWith = function(suffix) {
  return this.substring(this.length - suffix.length) == suffix;
}

String.prototype.concat = function(str) {
  return new String(this.toString() + str);
}

String.prototype.toCharArray = function() {
  var charArr = new Array();
  for (var i = 0; i < this.length; i++) charArr[i] = this.charAt(i);
  return charArr;
}

String.prototype.trim = function(wh) {
  if (!this.length) {
    return this;
  }
  if (wh > 0) {
    return this.replace(/^\s+/, "");
  } else if (wh < 0) {
    return this.replace(/\s+$/, "");
  } else {
    return this.replace(/^\s+|\s+$/g, "");
  }
}

String.prototype.ensureNotStartWith = function(sep){
  var len;
  if(!this || (len = this.length) == 0){
    return this;
  }
  var start = 0;
  if(sep.length == 0){
    return this;
  }else{
    while(start != len && sep.indexOf(this.charAt(start)) != -1){
      start++;
    }
  }
  return this.substring(start);
}

String.prototype.ensureStartWith = function(sep){
  if(!sep || (sep.length == 0)){
    return this;
  }
  if(this.startsWith(sep)){
    return this;
  }
  return sep+this;
}

String.prototype.ensureNotEndWith=function(sep){
  var end;
	if (!this || (end = this.length) == 0) {
	  return this;
	}

	if (sep.length == 0) {
	  return this;
	}
	else {
	  while ((end != 0) && (sep.indexOf(this.charAt(end - 1)) != -1)) {
	    end--;
	  }
	}
	return this.substring(0, end);
}

String.prototype.replaceAll = function(regex, target) {
	return this.replace(new RegExp(regex, "gm"), target);
}

String.prototype.trimStart = function() {
	return this.trim(1);
}

String.prototype.trimEnd = function() {
	return this.trim(-1);
};

String.prototype.toArray = function(sept) {
	var s=this.trim();
	if(!sept) sept=',';
	if(s<' ') return new Array();
	else return s.split(sept);
};

String.prototype.toHTML = function() {
  var r = this;
  r = r.replace(/\&/g, "&amp;").replace(/\>/g, "&gt;").replace(/\</g, "&lt;").replace(/\"/g, "&quot;");
  return r;
};

})(jQuery);

