(function($){
	$.succezBI = $.succezBI || {};
	$.succezBI.getDomByTag = function(tag) {
		if (typeof tag === "string") {
			switch (tag) {
				case "button" :
					return $("<input type='button' style='height:25px;width:30px;'/>");
				case "label" :
					return $("<p>表头</p>");
				case "textarea" :
					return $("<input type='edit'/>");
				case "table" : {
					var div = $("<div/>").draggable({
						    containment	: "parent"
					    });
					new $.succezBI.jTable({
						    renderTo	: div
					    });
					return div;
				};
				case "radio":
					return $("<div/>").html("<input type='radio'>单选</input>");
				case "sql":
					return $("<img src='image/components/sql.png'/>");
			}
		}
		return "";
	};
	
	$.fn.succezBI = $.fn.succezBI || {};
	
	$.fn.initEditor = function(){
		return new reportEditor(this);
	}
	
	function reportEditor(dom){
		this.container = $(dom);
		var layout = this.container.layout().data("layout");
		this.reportContainer = $("<div/>").addClass("container").appendTo(layout.panels["center"]);
		this.toolbarContainer = $("<div/>").appendTo(layout.panels["north"]);
		this.accordionContainer = $(".easyui-accordion").accordion().data("accordion");
		this.propertiesContainer = $("<div/>").appendTo(layout.panels["east"]);
		this.initPanels();
		this.initEvents();
	}
	
	reportEditor.prototype.initPanels = function(){
		this.initToolbar();
		this.initReportContent();
		this.initAccordion();
		this.initProperties();
	}
	
	reportEditor.prototype.initEvents = function(){
	}
	
	reportEditor.prototype.initToolbar = function(){
		this.toolbar = $(".coolbar").appendTo(this.toolbarContainer);
		this.toolbar.find("img").bind("click",function(){
			var fn = $(this).attr("cmd");
			if(fn){
				eval(fn);
			}else {
				alert("没有绑定单击处理函数");
			}
		});
	}
	
	reportEditor.prototype.updateProperty = function(dom){
		
	}
	
	reportEditor.prototype.initReportContent = function(){
		var _self = this;
		var tableObj = $("<div></div>").appendTo(this.reportContainer);
		tableObj.draggable({containment: "parent"});
		this.table = new $.succezBI.jTable({
			renderTo:tableObj
		});
		this.reportContainer.droppable({
			accept:'td>img',
			onDrop:function(e,source){
				var d = $.succezBI.getDomByTag($(source).attr("type")).draggable();
				d.bind("click",function(){
					$(".selectedObject").removeClass("selectedObject");
					d.addClass("selectedObject");
					_self.updateProperty(d);
				});
				$(this).append(d);
			}
		});
	}
	
	reportEditor.prototype.initComponentsList = function(){
		var _self = this;
		$("#component_list").children().each(function(index,item){
			var $this = $(item);
			var t = $("<table/>").css("width","100%").appendTo(_self.componentsContainer);
			var r = $("<tr/>").appendTo(t);
			var cell = $("<td/>").attr("align","center").appendTo(r);
			$this.appendTo(cell);
			$this.draggable({
				revert:true,
				deltaX:10,
				deltaY:10,
				proxy:function(source){
					var n = $.succezBI.getDomByTag($(source).attr("type")).addClass("proxy").appendTo('body');
					return n;
				}
			});
		});
	}
	
	reportEditor.prototype.initAccordion = function(){
		this.reportStruct = this.accordionContainer.panels[0];
		this.componentsContainer = this.accordionContainer.panels[1].panel("body");
		$("li").bind("click",function(e){
			if(e.target != this) return;
			var $this = $(this);
			if($this.hasClass("collapse")){
				$this.removeClass("collapse");
				$this.find("ul").hide("fast");
				$this.addClass("expand");
			}else if($this.hasClass("expand")){
				$this.removeClass("expand");
				$this.find("ul").show("slow");
				$this.addClass("collapse");
			}else if($this.children().length == 0){
				$(".selected_node").removeClass("selected_node");
				$this.addClass("selected_node");
			}
		});
		this.initComponentsList();
		return;
		
		this.componentsContainer.find("img").draggable({
			revert:true,
			deltaX:10,
			deltaY:10,
			proxy:function(source){
				var n = $.succezBI.getDomByTag($(source).attr("type")).addClass("proxy").appendTo('body');
				return n;
			}
		});
	}
	
	reportEditor.prototype.initProperties = function(){
		var _self = this;
		this.propertiesContainer.jproeditor({
			defaultType:'type',
			items:[
				{
					title:'报表代号',
					type:'edit',
					events:[{
						name:'change',
						fn:function(e){
							var obj = e.data;
							$("#rptid").text(obj.attr("value"));
						}
					}]
				},{
					title:'报表名称',
					type:'edit',
					events:[{
						name:'change',
						fn:function(e){
							var obj = e.data;
							$("#rptnm").text(obj.attr("value"));
						}
					}]
				},{
					title:'隐藏表格',
					type:'checkbox',
					events:[{
						name:'change',
						fn:function(e){
							var obj = e.data;
							$("#showgrid").text(obj.attr("checked")?"是":"否");
						}
					}]
				},{
					title:'报表参数',
					type:'editCanPick',
					align:'center'
				},{
					title:'报表风格',
					type:'combobox',
					options:[{
						caption:'缺省',
						value:'#B6CADD'
					},{
						caption:'橘黄',
						value:'#E0C491'
					},{
						caption:'橘红',
						value:'#DEBDDE'
					},{
						caption:'淡蓝',
						value:'#AFD0A0'
					},{
						caption:'经典',
						value:'#C0C0C0'
					},{
						caption:'红色',
						value:'#FF0000'
					},{
						caption:'绿色',
						value:'00FF00'
					},{
						caption:'蓝色',
						value:'0000FF'
					}],
					events:[{
						name:'change',
						fn:function(e){
							var obj = e.data;
							_self.table.table.find("td").each(function(index,item){
								$(item).css("border-color",obj.attr("value"));
							});
							_self.table.table.css("border-color",obj.attr("value"));
						}
					}]
				},{
					title:'每页行数',
					type:'edit',
					events:[{
						name:'change',
						fn:function(e){
							var obj = e.data;
							$("#rows").text(obj.attr("value"))
						}
					}]
				},{
					title:'报表类型',
					type:'radio',
					name:'report_type',
					items:[{
						value:'ana_document',
						caption:'分析报告',
						checked:true
					},{
						value:'ana_report',
						caption:'分析表'
					},{
						caption:'主题表',
						value:'dwsubject'
					}],
					events:[{
						name:'click',
						fn:function(e){
							$("#rpttype").text(e.data.attr("value"));
						}
					}]
				}
			]
		});
	}
})(jQuery);