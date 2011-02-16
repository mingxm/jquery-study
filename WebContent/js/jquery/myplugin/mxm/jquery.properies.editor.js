/**
 * BI@report中属性编辑器插件
 */
(function($){
	$.fn.extend({
		jproeditor:function(setting){
			/**
			 * 对属性编辑器传入的参数进行处理。属性编辑器中的每个编辑器项目都存放在数组items中，
			 * 该数组中的每个item都是一个对象，里面记录的信息包括标题名称，编辑器类型，事件处理
			 * 函数等，其中事件处理函数根据不同的编辑器类型可能有不同名称不同数目的回调函数。
			 */
			var config = $.extend({},{
				renderTo:$(document.body),
				width:100,
				titleWidth:0.3,
				titleAlign:'center',
				caption:'属性',
				defaultType:'edit',
				items:[]
			},setting);
			
			/**
			 * 属性编辑器内部布局为了整齐还是用table进行布局。下面是生成布局table并且生成属性编辑器
			 * 标题的代码
			 */
			var tableObj = $('<table></table>').appendTo(config.renderTo);
			var row = $('<tr></tr>').appendTo(tableObj);
			tableObj.css('width',config.width);
			$('<td colspan=2>'+config.caption+'</td>')
				.css('text-align',config.titleAlign).appendTo(row);
			
			/**
			 * 以下是建立属性编辑器中的各编辑器项目，每个编辑器项目的配置信息必须至少包括以下2个：标题、
			 * 类型
			 */
			for(var i=0;i<config.items.length;i++){
				var item = config.items[i];
				row = $('<tr></tr>').appendTo(tableObj);
				var title = $('<td>'+item.title+'</td>').appendTo(row);
				title.css('width',config.titleWidth*config.width);
				
				var info = $.extend({},{
					title:'title',
					type:config.defaultType,
					defaultValue:'',
					align:'left'
				},item);
				
				var editor = $('<td></td>').appendTo(row);
				var type = info.type;
				var obj;
				if(type == 'checkbox'){
					
				}else if(type == 'edit'){
					/**
					 * TODO 是否还需要控制最多输入多少字符等属性？
					 */
					obj = $('<input type="text" value="'+info.defaultValue+'"/>')
						.css('text-align',info.align).appendTo(editor);
				}else if(type == 'combobox'){
					
				}else if(type == 'radio'){
					
				}else if(type == 'editCanPick'){
					
				}else if(type == 'file'){
					
				}else if(type == 'password'){
					obj = $('<input type="password" value="'+info.defaultValue+'"/>')
						.css('text-align',info.align).appendTo(editor);
				}
				obj.css('width',(1-config.titleWidth)*config.width);
			}
			
			/**
			 * TODO
			 * 最后需要返回一个什么对象给调用者呢？这个对象中需要记录的是调用者创建该编辑器后可能需要进行操作
			 * 所必须的信息。这个需要仔细考虑
			 */
			 return;
		}
	})
})(jQuery);