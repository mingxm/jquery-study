/**
 * BI@report中属性编辑器插件
 * 属性编辑器参数使用说明：
 * renderTo：需要渲染到的dom对象，如果不传则默认维document.body
 * width：该属性编辑器的宽度
 * titleWidth：属性编辑器中的每个编辑器项的名称宽度，0-1之间，默认为0.3
 * titleAlign：名称的水平对齐方式，默认居中
 * caption：属性编辑器的标题
 * defaultType：属性编辑器中的编辑器项的默认类型，当编辑器项没有传类型的时候会取默认类型
 * items：存编辑器项的数组
 * 
 * 编辑器项的参数使用说明：
 * title：名称
 * type：编辑器类型
 * defaultValue：默认值，某些类型的编辑器不需要
 * align：文字的水平对齐方式
 * events：编辑器的事件绑定数组，每个项都是一个包含有事件名称和事件处理函数的对象
 * options：仅对combobox有效，列表内容数组，每项中都是一个包含列表项信息的对象
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
			var tableObj = $('<table></table>')
				.attr("frame","border")
				.attr("rules","all").appendTo(config.renderTo);
			var row = $('<tr></tr>').appendTo(tableObj);
			tableObj.css('width',config.width);
			$('<td colspan=2>'+config.caption+'</td>')
				.css('text-align',config.titleAlign).appendTo(row);
			
			/**
			 * 以下是建立属性编辑器中的各编辑器项目，每个编辑器项目的配置信息必须至少包括以下2个：标题、
			 * 类型
			 */
			$.each(config.items,function(i,item){
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
					obj = $('<input type="checkbox"'+(info.defaultValue?" checked":"")+'/>').appendTo(editor);
				}else if(type == 'edit'){
					/**
					 * TODO 是否还需要控制最多输入多少字符等属性？
					 */
					obj = $('<input type="text" value="'+info.defaultValue+'"/>')
						.css('text-align',info.align).appendTo(editor);
				}else if(type == 'combobox'){
					obj = $('<select></select>').appendTo(editor);
					var ops = info.options;
					if(ops){
						$.each(ops,function(index,item){
							var op = $('<option></option>').appendTo(obj);
							$.each(item,function(key,val){
								if(key == "caption"){
									op.text(item[key]);
								}else if(key == "selected" && val){
									op.attr(key,true);
								}else {
									op.attr(key,val);
								}
							});
						})
					}
				}else if(type == 'radio'){
					var name = info.name?info.name:"new_radio";
					var items = info.items;
					if(!items || items.length == 0){
						return;
					}
					var selectName = items[0].value;
					for(var j=0;j<items.length;j++){
						var item = items[j];
						if(item.checked){
							selectName = item.value;
						}
						$('<input type="radio" name="'+name+'" value="'+item.value+'">'+item.caption+'<br>')
							.appendTo(editor);
					}
					var rs = $('input:[name='+name+']:radio');
					rs.each(function(index,item){
						$item = $(item);
						if($item.attr('value') == selectName){
							$item.attr('checked',true);
						}
						$.each(info.events,function(j,event){
							$item.bind(event.name,$item,event.fn);
						})
					});
				}else if(type == 'editCanPick'){
					var obj = $('<table></table>').appendTo(editor);
					var r = $('<tr></tr>').appendTo(obj);
					var o1 = $('<td></td>').appendTo(r);
					var t = $('<input type="text" value="'+info.defaultValue+'"/>')
						.css('width',(1-config.titleWidth)*config.width-30).appendTo(o1);
					var o2 = $('<td></td>').appendTo(r);
					var b = $('<input type="button" value="."/>').appendTo(o2);
				}else if(type == 'file'){
					obj = $.fn.jUploadFile({
						renderTo:editor,
						width:(1-config.titleWidth)*config.width
					});
				}else if(type == 'button'){
					obj = $('<input type="button" value="'+info.defaultValue+'"/>').css('align','center').appendTo(editor);
				}else if(type == 'password'){
					obj = $('<input type="password" value="'+info.defaultValue+'"/>')
						.css('text-align',info.align).appendTo(editor);
				}
				editor.css('width',(1-config.titleWidth)*config.width);
				
				/**
				 * 绑定消息的处理函数
				 */
				if(obj){
					var events = info.events?info.events:[];
					$.each(events,function(index,item){
						obj.bind(item.name,obj,item.fn);
					})
				}
			});
			
			/**
			 * TODO
			 * 最后需要返回一个什么对象给调用者呢？这个对象中需要记录的是调用者创建该编辑器后可能需要进行操作
			 * 所必须的信息。这个需要仔细考虑
			 */
			 return;
		}
	})
})(jQuery);