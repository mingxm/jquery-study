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
   		  nodeDelete:'',
   		  //当前需要编辑或正在编辑的节点
   		  currentNode:{},
   		  //上一个被编辑的节点
   		  oldNode:{}
   		};
   		$.extend(true,defaultSetting,option);
   		
   		//绑定用户自定义的节点点击之前发生的事件
   		$(this).live(PRENODECLICK,function(event){
   		  if(typeof(defaultSetting.preNodeCilck)=="function")
   		      defaultSetting.preNodeClick(event);
   		  });
   		//静态初始化
   		showTree($(this),defaultSetting);	
   		
   		var biTreePlugin={};
   		//设置
   		biTreePlugin.Setting=this.defaultSetting;
   		biTreePlugin.parent=this;
   		
   		biTreePlugin.bindrightClick=function(){
   			$("."+defaultSetting.fileNode_class).live("contextmenu",function(event){
   				//处于编辑状态的时候不允许再弹出右键菜单，这里的处理是立即返回
   				if (defaultSetting.isEditing)
   				{
   				  	return false;
   				}else{
   					defaultSetting.currentNode=event.target;
   					var menu=$(defaultSetting.rightMenuId);
   					menu.show(300);
   					menu.css("left",event.pageX);
   					menu.css("top",event.pageY);
   					return false;
   				}
   			});
   			//绑定右键菜单的新建节点子菜单项
   			$(defaultSetting.newNode).live("click",function(event){
   				$(this).parent().hide();
   				var m_newNode=$("<li><span class="+defaultSetting.fileNode_class+"><input type='text' value=''><span></li>");
   				$(defaultSetting.currentNode).parent().parent().after(m_newNode);
   				var m_replaceNode=$("<a href='#'></a>");
   				defaultSetting.oldNode=m_replaceNode;
   				defaultSetting.currentNode=$(m_newNode).find("input");
   				defaultSetting.isEditing=true;
   			});
   			//绑定右键菜单的编辑节点菜单项
   			$(defaultSetting.nodeEdit).live("click",function(event){
   				if (defaultSetting.isEditing)
   				{
   					return;
   				}else{
   					var value=$(defaultSetting.currentNode).text();
					var m_width=$(defaultSetting.currentNode).width();
					var m_href=$(defaultSetting.currentNode).attr("href");
					//将<a>节点元素替换为文本输入框，供用户编辑，在页面点击事件中将用户输入后的内容还原成<a>元素内容
					var temp=$("<input type='text' style='overflow:visible;width:"+m_width+"px' value="+value+">");
					$(defaultSetting.currentNode).replaceWith(temp);
					defaultSetting.oldNode=defaultSetting.currentNode;
   			   		defaultSetting.currentNode=temp;
   			   		defaultSetting.isEditing=true;
   			   		//将右键菜单隐藏起来
   			   		$(this).parent().hide(200);
   				};
   			});
   			//绑定右键菜单的删除节点菜单项
   			$(defaultSetting.nodeDelete).live("click",function(event){
   				$(defaultSetting.currentNode).parent().parent().remove();
   				$(this).parent().hide();	
   			});
   			//绑定新建节点子菜单的移进移出事件
   			$(defaultSetting.newNode).hover(function(){
   				$(this).css("background-color","#4F9D9D");
   			},function(){
   				$(this).css("background-color","");
   			});
   			//绑定删除子菜单的移进移出事件
   			$(defaultSetting.nodeDelete).hover(function(){
   				$(this).css("background-color","#4F9D9D");
   			},function(){
   				$(this).css("background-color","");
   			});
   			//绑定编辑子菜单的鼠标移进移出事件
   			$(defaultSetting.nodeEdit).hover(function(){
   				$(this).css("background-color","#4F9D9D");
   			},function(){
   				$(this).css("background-color","");
   			});
   			/*
   		 	* 绑定页面上的键盘事件，如用户按下的是回车键那么，结束编辑节点
   		 	*/
   		 	$(document).keydown(function(event){
              	if (event.keyCode==13){
              		var m_text=$(defaultSetting.currentNode).attr("value");
              		$(defaultSetting.oldNode).text(m_text);
              		$(defaultSetting.currentNode).replaceWith(defaultSetting.oldNode);
              		defaultSetting.isEditing = false;
              	}
      	 	});
   		};
   		return biTreePlugin;
   };   
   //根据传入的xml文件路径，初始化根节点
   function showTree(item,Setting){
   		if (Setting.xmlPath=="") return fasle;
   		//加载初始化所需的xml文件
   		var html=$("<div/>");	
   		//初始化根节点
   		initNodes(html,Setting,"0");
   		//将节点加入到html的Dom之中
   		item.append(html);
   		//绑定加减号按钮的click事件
   		$("."+Setting.plus_Ico_class).live("click",function(e){
   			if ($(this).parent().data("loaded")==false){
   				initNodes($(this).parent(),Setting,$(this).attr("id"));
   				$(this).parent().data("loaded",true);
   			}
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
/*   function initNodes(xmlDoc,htmlDoc,Setting,id){
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
   }*/
   
   function initNodes(htmlDoc,Setting,id){ 
   	    //定义一个节点对象
   		var xmlDoc={};
   		//首先从服务器请求所需要的节点
   	   	$.ajax({
		   type:"GET",
		   url:Setting.xmlPath,
		   dataType:"xml",
		   timeout:1000,
		   error:function(xml){
		             alert("error!");
		             return;
		         },
		   success:function(xml){
		            //如果加载成功，那么首先初始化根节点
		   			xmlDoc=xml;
		         }         		      			
   		});
   		//因为返回的节点是全部的节点，所以要进行筛选
   		$(xmlDoc).find("[parent_Id="+id+"]").each(function(){
   			//如果还有子节点，那么该节点就是父节点
   			if ($(this).children().length>0){
   				var node=$("<ul/>");
				var nodeText=$(this).attr("text");
				var nodeId=$(this).attr("id");
   				if (nodeText && nodeText!='')
   				{
   					node.append($("<div class="+Setting.plus_Ico_class+" id="+nodeId+"></div>"));
   					node.append($("<li><span class="+Setting.root_Ico_class+">"+nodeText+"</span></li>"));                               		  	   
   				}  
   				$(node).data("loaded",false);
   				htmlDoc.append(node);
   			}else
   			{
   				//子节点直接添加到htmlDoc之中
   				var m_text = $(this).text();
   				var m_href = $(this).attr("href");
   				htmlDoc.append($("<li><span class="+Setting.fileNode_class+"><a href="+m_href+">"+m_text+"</a></span></li>"));
   			}
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
    		childelememt.slideDown(300);
    	    $(m_target).toggleClass("clickSubErea clickPlusErea");
    	}else
    		alert("No childNode");   
   }
/*
 * 树节点的展开事件
 */   
   function treeFold(e){
    	var m_target=e.target;
    	$(m_target).next().nextAll().slideUp(300);
    	  $(m_target).toggleClass("clickPlusErea clickSubErea");     
   }
})(jQuery)