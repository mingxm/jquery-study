(function($){
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
	}
})(jQuery);

 
