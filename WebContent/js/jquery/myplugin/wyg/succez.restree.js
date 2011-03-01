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
 * 根据传入的xml路径去初始化一颗资源树
 * @xmlpath:xml文件的路径
 * @id：xml文件中根节点的id
 * @element：将要动态添加新创建元素的元素
 */		
	function initTree(xmlpath,id,element){
		var xmlDoc=loadTreeXML(xmlpath);
		if(xmlDoc){
			$(xmlDoc).find("#"+id).each(function(){
				$(this).find("> rootnode").each(function(){
					var id=$(this).attr("id");
					var m_div=$('<div class="clickPlusErea" loaded="false"></div>');
					m_div.attr("id",id);
					var temp=$("<ul/>");
					temp.append(m_div).append($('<li class="roottree">'+$(this).attr("text")+'</li>'));		   	
			   		element.append(temp);
				});
				$(this).find("> leafnode").each(function(){
					element.append($('<ul><li><span class="treefile">'+$(this).text()+"</span></li></ul>"));	
				});				
			});
		}		
	}
	/*
	* 处理节点的展开和收起事件
	*/	
	$.fn.treeFoldOrNot = function(){
		$(this).live("click",function(event){			
			if ($(this).attr("loaded")!="true")
			{
    			$(this).attr("loaded","true");
    			var id=$(this).attr("id");
    		    initTree("../../../js/jquery/myplugin/wyg/XML/m_tree.xml",id,$(this).next());
			} 
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
    		}
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
 * 留给外部调用的接口
 */
	$.fn.initTreeByXml=function(xmlpath,id,element){
		initTree(xmlpath,id,element);
	};
})(jQuery);

 
