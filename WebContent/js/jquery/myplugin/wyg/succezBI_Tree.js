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
   		  //定义加号的button的图标类型和样式
   		  plus_Ico_class:"clickPlusErea",
   		  //定义减号的button的图标类型和样式
   		  sub_Ico_class:"clickSubErea",
   		  //定义root根节点上图标的class属性
   		  root_Ico_class:"treefolder",
   		  //叶子节点的图标样式
   		  fileNode_class:"treefile",
   		  //节点被点击之前发生的用户自定义事件
   		  preNodeCilck:null,
   		  //右键菜单的id
   		  rightMenuId:'',
   		  //下面三个都是子菜单的ID
   		  newNode:'',
   		  nodeEdit:'',
   		  nodeDelete:''
   		};
   		$.extend(true,defaultSetting,option);
   		
   		//绑定用户自定义的节点点击之前发生的事件
   		$(this).live(PRENODECLICK,function(event){
   		  if(typeof(defaultSetting.preNodeCilck)=="function")
   		      defaultSetting.preNodeClick(event);
   		  });
   		//静态初始化
   		showTree($(this),defaultSetting.xmlPath,defaultSetting);	
   		
   		var biTreePlugin={};
   		//设置
   		biTreePlugin.Setting=this.defaultSetting;
   		biTreePlugin.parent=this;
   		//鼠标右键点击的当前节点
   		biTreePlugin.currentNode={};
   		biTreePlugin.test=function() {
   			alert("test");
   		};
   		biTreePlugin.bindrightClick=function(){
   			$("."+defaultSetting.fileNode_class).live("contextmenu",function(event){
   				this.currentNode=event.target;
   				var menu=$(defaultSetting.rightMenuId);
   				menu.css("display","block");
   				menu.css("left",event.pageX);
   				menu.css("top",event.pageY);
   				return false;
   			});
   			//绑定右键菜单的新建节点子菜单项
   			$(defaultSetting.newNode).live("click",function(event){
   			
   			});
   			//绑定右键菜单的编辑节点菜单项
   			$(defaultSetting.nodeEdit).live("click",function(event){
 				var value=$(this).text();
				var m_width=$(this).width();
				//将<a>节点元素替换为文本输入框，供用户编辑，在页面点击事件中将用户输入后的内容还原成<a>元素内容
				$(this).replace($("<input type='text' style='overflow:visible;width:"+m_width+"px' value="+value+">"));					
   			});
   			//绑定右键菜单的删除节点菜单项
   			$(defaultSetting.nodeDelete).live("click",function(event){
   			
   			});
   		};
   		return biTreePlugin;
   
   };   
   //根据传入的xml文件路径，全量初始化所有的节点
   function showTree(item,xmlPath,Setting){
   		if (xmlPath=="") return fasle;
   		//加载初始化所需的xml文件
   		var html=$("<div/>");
   		//标识当前加载的数据为第几层的数据
   		var level=1;
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
		         	initNodes($(xml).find("nodes"),html,Setting,level);  
		         }         		      			
   		});	
   		//将节点加入到html的Dom之中
   		item.append(html);
   		//绑定加减号按钮的click事件
   		$("."+Setting.plus_Ico_class).live("click",function(e){
   			treeUnfold(e);
   			return false;
   		});
   		$("."+Setting.sub_Ico_class).live("click",function(e){
   			treeFold(e);
   			return false;
   		});
   		//绑定根节点的展开和收缩事件
   		$("."+Setting.root_Ico_class).live("dblclick",function(e){
   			$(this).trigger(PRENODECLICK);
   			var m_element=$(this).parent().prev();
   				//触发加减号的点击事件
   				m_element.trigger("click");
   		});
   		/*绑定整个文档的点击事件，如果文档的其他地方被点击，那么要做的事情是：
   		* 1、收起右键菜单
   		*/
   		$(document).bind("click",function(){
   			$(Setting.rightMenuId).css("display","none");
   		});
   }
/*
 * 根据XML中的数据结构，除了Nodes以外，所有节点均为Node标签定义，有明确的层次结构,
 * 所以初始化的基本思想就是递归遍历
 */
   function initNodes(xmlDoc,htmlDoc,Setting,level){
   	    //递归遍历
   		xmlDoc.find("> node").each(function(){
   			if ($(this).find("> node").length>0){
   				if (level==1){
					var node=$("<ul/>");
   				}else
   				{
   					var node=$("<ul style='display:none'></ul>");
   				}
   				var nodeText=$(this).attr("text");
   				if (nodeText && nodeText!='')
   				{
   					node.append($("<div class="+Setting.plus_Ico_class+"></div>"));
   					node.append($("<li><span class="+Setting.root_Ico_class+" id="+"succezNode"+(++NodeNumber).toString()+">"+nodeText+"</span></li>"));                               		  	   
   				}
   				level++;
   				initNodes($(this),node,Setting);
   				--level;
   		        htmlDoc.append(node);   				
   			}else{
   				var m_text = $(this).text();
   				var m_href = $(this).attr("href");
   				if (level==1)
   				{
   					htmlDoc.append($("<li><span class="+Setting.fileNode_class+"><a href="+m_href+">"+m_text+"</a></span></li>"));   				   			
   				}else
   				{
   					htmlDoc.append($("<li style='display:none'><span class="+Setting.fileNode_class+"><a href="+m_href+">"+m_text+"</a></span></li>"));   				   			   				    
   				}
   			};	
   			
   		});    	
   }
/*
 * 树节点的收缩事件
 */
   function treeUnfold(e){
   		//获取触发该事件的元素
		var m_target=e.target;
		$(m_target).css("border","1px,solid #FF0000");
    	var childelememt=$(m_target).next().nextAll();
    	//判断节点的是否含有子节点 
    	if (childelememt.length>0){
    		childelememt.show(500);
    	    $(m_target).toggleClass("clickSubErea clickPlusErea");
    	}else
    		alert("No childNode");   
   }
/*
 * 树节点的展开事件
 */   
   function treeFold(e){
    	var m_target=e.target;
    	$(m_target).next().nextAll().hide(200);
    	  $(m_target).toggleClass("clickPlusErea clickSubErea");     
   }
})(jQuery)