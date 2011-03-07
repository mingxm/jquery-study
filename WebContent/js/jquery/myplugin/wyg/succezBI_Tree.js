(function($){
	//定义常量
	PRENODECLICK="node_click_Befor";
	
	//定义全局变量
	var NodeNumber=0;
	
	$.fn.sussez_Tree=function(option){
   		var defaultSetting={
   		  //传入的XML文件的路径，目前采取全量加载
   		  xmlPath:"",
   		  //是否处于编辑节点名的状态
   		  isEditing:false,
   		  //根节点前面加载的图标类型，默认为文件夹图标
   		  rootIco_class:"floder",
   		  //定义加号的button的图标类型和样式
   		  plus_Ico_class:"clickPlusErea",
   		  //定义减号的button的图标类型和样式
   		  sub_Ico_class:"clickSubErea",
   		  //定义root根节点上图标的class属性
   		  root_Ico_class:"treefolder",
   		  //叶子节点的图标样式
   		  fileNode_class:"treefile",
   		  //节点被点击之前发生的用户自定义事件
   		  preNodeCilck:undefined
   		};
   		
   		$.extend(defaultSetting,option);
   		
   		//绑定用户自定义的节点点击之前发生的事件
   		$(this).live("PRENODECLICK",function(event){
   		  if(typeof(defaultSetting.preNodeCilck)=="function")
   		      defaultSettint.preNodeClick(event);
   		  });	   
   		//静态初始化
   		showTree($(this),defaultSetting.xmlPath,defaultSetting);	
   };   
   //根据传入的xml文件路径，全量初始化所有的节点
   function showTree(item,xmlPath,Setting){
   		if (xmlPath=="") return fasle;
   		//加载初始化所需的xml文件
   		var html=$("<div/>");
   		$.ajax({
		   type:"GET",
		   url:xmlPath,
		   dataType:"xml",
		   timeout:1000,
		   error:function(xml){
		             alert("error!");
		             return;
		         },
		   success:function(xml){
		            //如果加载成功，那么初始化所有的节点
		         	initNodes($(xml).find("nodes"),html,Setting);  
		         }         		      			
   		});	
   		item.append(html);
   		//绑定加减号按钮的click事件
   		$("."+Setting.plus_Ico_class).live("click",function(e){
   			    //获取触发该事件的元素
   			    var m_target=e.target;
    			var childelememt=$(m_target).next().nextAll();
    			//判断节点的是否含有子节点 
    			if (childelememt.length>0){
    				childelememt.show("slow");
    	    		$(m_target).toggleClass("clickSubErea clickPlusErea");
    			}    
    		    else
    				alert("No childNode");
		  		      
   		});
   		$("."+Setting.sub_Ico_class).live("click",function(e){
    		var m_target=e.target;
    		$(m_target).next().nextAll().hide("fast");
    	  	$(m_target).toggleClass("clickPlusErea clickSubErea");
   		});
   }
/*
 * 根据XML中的数据结构，除了Nodes以外，所有节点均为Node标签定义，有明确的层次结构,
 * 所以初始化的基本思想就是递归遍历
 */
   function initNodes(xmlDoc,htmlDoc,Setting){
   	    //递归遍历
   		xmlDoc.find("> node").each(function(){
   			if ($(this).find("> node").length>0){
				var node=$("<ul/>");
   				var nodeText=$(this).attr("text");
   				if (nodeText && nodeText!='')
   				{
   					node.append($("<div class="+Setting.sub_Ico_class+"></div>"));
   					node.append($("<li><span class="+Setting.root_Ico_class+" id="+"succezNode"+(NodeNumber++).toString()+">"+nodeText+"</span></li>"));                               		  	   
   				}
   				initNodes($(this),node,Setting);
   		        htmlDoc.append(node);   				
   			}else{
   				var m_text = $(this).text();
   		    	//初始化叶子节点
   				htmlDoc.append($("<li><span class="+Setting.fileNode_class+">"+m_text+"</span></li>"));	
   			};	
   			
   		});    	
   }
   
})(jQuery)