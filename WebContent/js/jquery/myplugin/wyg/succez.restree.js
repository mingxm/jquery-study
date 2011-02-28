(function($){
/*
 * 根据传入的XML路径去获取xml，现在用一个自定义函数，以后可以改用jquery的ajax
 * 函数，因为ajax函数在本地无法装入xml文件，只能在服务器上运行，但是ajax函数的
 * 执行效率却是下边该函数的几倍,另外该方法也有跨域请求的问题，待解决，在fixfoc
 * 中无法运行
 */	
	function loadTreeXML(xmlpath){
	    var xmlDoc=null;
	    if(window.ActiveXObject){
	        xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
	    }
	    else if(document.implementation && document.implementation.createDocument){
	        xmlDoc=document.implementation.createDocument("","",null);
	    }else{
	        alert("this has an error happened!");
	    }
	    xmlDoc.async=false;
	    xmlDoc.load(xmlpath);
	    return xmlDoc;
	};	
	/*
	* 处理节点的展开和收起事件
	*/	
	$.fn.treeFoldOrNot = function(){
		$(this).bind("click",function(event){
		//如果节点是展开的，收起该节点 
			if ($(this).hasClass("clickSubErea")){
    			$(this).next().find(">ul").hide("fast");
    	  		$(this).removeClass();
    	  		$(this).addClass("clickPlusErea");
    		} 
    		//如果节点是收起的，展开该节点 
    		else if ($(this).hasClass("clickPlusErea")){
    			var childelememt=$(this).next().find(">ul");
    			//判断节点的是否含有子节点 
    			if (childelememt.length>0){
    				childelememt.show("slow");
    	    		$(this).removeClass();
    	    		$(this).addClass("clickSubErea");
    			}    
    			else
    				alert("No childNode");
    		};
    		event.stopPropagation();//阻止click事件起泡  
    	});
	};
	/*
    * 处理div树的拖动，从而变换位置
    */    	
	$.fn.TreeMoveEvent = function(){
		var _x,_y;
    	var moveFlag=false;
    	$(this).bind("mousedown",function(event){
    		moveFlag=true;
    		$(this).css("cursor","move");
    		var offset=$(this).offset();
   	        _x=event.pageX-offset.left;
    	    _y=event.pageY-offset.top;    	    
    	});  
        $(this).bind("mousemove",function(event){
        	var x=event.pageX-_x;
        	var y=event.pageY-_y;			
			if (moveFlag){
	        	$("#testpage").text(x+","+y); 
	        	$(this).css("left",x);	
	        	$(this).css("top",y);
			}
        });
    	$(this).bind("mouseup",function(){
    		$(this).css("cursor","default");
			moveFlag=false;
    	});
	};
/*
 * 根据传入的xml路径去初始化一颗资源树
 */	
	$.fn.initTreeByXml=function(xmlpath){
		var xmlDoc=loadTreeXML(xmlpath);
		if (xmlDoc){		
		$(xmlDoc).find("nodes > rootnode").each(function(){
			var temp=$(this).find(">leafnode").text();
			alert(temp);
			var temp=$(this).find(">rootnode").attr("text");
			alert(temp);
		});
		}; 	
	};
})(jQuery);

 
